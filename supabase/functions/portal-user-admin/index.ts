import { createClient } from "npm:@supabase/supabase-js@^2";
import { corsHeaders } from "npm:@supabase/supabase-js@^2/cors";

type JsonObject = Record<string, unknown>;

class HttpError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

function jsonResponse(body: JsonObject, status = 200) {
    return Response.json(body, {
        status,
        headers: corsHeaders
    });
}

function serviceKey() {
    const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
    if (secretKeys) {
        let parsed: JsonObject;
        try {
            parsed = JSON.parse(secretKeys);
        } catch {
            throw new HttpError("Supabase secret-key configuration is invalid.", 500);
        }

        if (typeof parsed.default === "string" && parsed.default) {
            return parsed.default;
        }
    }

    const legacyServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (legacyServiceKey) {
        return legacyServiceKey;
    }

    throw new HttpError("The Supabase server-side secret key is not configured.", 500);
}

function normalizeText(value: unknown, label: string, maxLength: number) {
    if (typeof value !== "string") {
        throw new HttpError(label + " is required.", 400);
    }

    const normalized = value.trim();
    if (!normalized || normalized.length > maxLength) {
        throw new HttpError(label + " must be between 1 and " + maxLength + " characters.", 400);
    }

    return normalized;
}

function normalizeEmail(value: unknown) {
    const email = normalizeText(value, "Email", 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new HttpError("Enter a valid email address.", 400);
    }
    return email;
}

function normalizeLevel(value: unknown) {
    const level = Number(value);
    if (!Number.isInteger(level) || level < 1 || level > 8) {
        throw new HttpError("Level must be a whole number from 1 to 8.", 400);
    }
    return level;
}

function normalizeGroup(value: unknown) {
    if (value === undefined || value === null) {
        return "";
    }
    if (typeof value !== "string" || value.trim().length > 80) {
        throw new HttpError("Group must be 80 characters or fewer.", 400);
    }
    return value.trim();
}

function normalizeUserId(value: unknown) {
    if (typeof value !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
        throw new HttpError("A valid user ID is required.", 400);
    }
    return value;
}

function isBanned(user: { banned_until?: string | null }) {
    return Boolean(user.banned_until && new Date(user.banned_until).getTime() > Date.now());
}

function currentBanDuration(user: { banned_until?: string | null }) {
    if (!isBanned(user) || !user.banned_until) {
        return "none";
    }

    const remainingHours = Math.max(
        1,
        Math.ceil((new Date(user.banned_until).getTime() - Date.now()) / 3_600_000)
    );
    return remainingHours + "h";
}

function userSummary(
    user: {
        id: string;
        email?: string;
        created_at?: string;
        last_sign_in_at?: string | null;
        banned_until?: string | null;
    },
    profile: {
        full_name: string;
        level: number;
        group_name: string;
        active: boolean;
    },
    timeStats: {
        time_entry_count?: number;
        total_seconds?: number;
        open_entries?: number;
    } = {}
) {
    return {
        id: user.id,
        email: user.email ?? "",
        full_name: profile.full_name,
        level: profile.level,
        group_name: profile.group_name,
        active: profile.active && !isBanned(user),
        created_at: user.created_at ?? null,
        last_sign_in_at: user.last_sign_in_at ?? null,
        time_entry_count: Number(timeStats.time_entry_count ?? 0),
        total_seconds: Number(timeStats.total_seconds ?? 0),
        open_entries: Number(timeStats.open_entries ?? 0)
    };
}

async function loadTimeStats(admin: ReturnType<typeof createClient>, userIds: string[]) {
    if (userIds.length === 0) {
        return new Map<string, JsonObject>();
    }

    const { data, error } = await admin
        .from("portal_user_time_stats")
        .select("user_id, time_entry_count, total_seconds, open_entries")
        .in("user_id", userIds);

    if (error) {
        throw new HttpError("Could not load time sheet statistics: " + error.message, 500);
    }

    const statsByUser = new Map<string, JsonObject>();
    (data ?? []).forEach((row: JsonObject) => {
        statsByUser.set(String(row.user_id), row);
    });
    return statsByUser;
}

async function listUsers(admin: ReturnType<typeof createClient>) {
    const users = [];
    const perPage = 1000;
    let page = 1;

    while (true) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
        if (error) {
            throw new HttpError("Could not list portal users: " + error.message, 500);
        }

        const currentPage = data.users ?? [];
        users.push(...currentPage);
        if (currentPage.length < perPage) {
            break;
        }
        page += 1;
    }

    const userIds = users.map(user => user.id);
    const profiles = new Map<string, JsonObject>();

    if (userIds.length > 0) {
        const { data, error } = await admin
            .from("portal_user_profiles")
            .select("user_id, full_name, level, group_name, active")
            .in("user_id", userIds);

        if (error) {
            throw new HttpError("Could not load portal user profiles: " + error.message, 500);
        }

        (data ?? []).forEach((profile: JsonObject) => {
            profiles.set(String(profile.user_id), profile);
        });

        const missingProfiles = users
            .filter(user => !profiles.has(user.id))
            .map(user => {
                const metadataName =
                    typeof user.user_metadata?.full_name === "string"
                        ? user.user_metadata.full_name.trim()
                        : "";
                const emailName = user.email?.split("@")[0] ?? "";
                return {
                    user_id: user.id,
                    full_name: metadataName || emailName || "Portal user",
                    level: 1,
                    group_name: "",
                    active: !isBanned(user)
                };
            });

        if (missingProfiles.length > 0) {
            const { error: insertError } = await admin
                .from("portal_user_profiles")
                .upsert(missingProfiles, { onConflict: "user_id" });

            if (insertError) {
                throw new HttpError("Could not initialize user profiles: " + insertError.message, 500);
            }

            missingProfiles.forEach(profile => profiles.set(profile.user_id, profile));
        }
    }

    const timeStats = await loadTimeStats(admin, userIds);
    return users.map(user => {
        const profile = profiles.get(user.id);
        if (!profile) {
            throw new HttpError("A portal user profile could not be loaded.", 500);
        }
        return userSummary(
            user,
            {
                full_name: String(profile.full_name),
                level: Number(profile.level),
                group_name: String(profile.group_name ?? ""),
                active: Boolean(profile.active)
            },
            (timeStats.get(user.id) ?? {}) as {
                time_entry_count?: number;
                total_seconds?: number;
                open_entries?: number;
            }
        );
    });
}

async function getProfile(admin: ReturnType<typeof createClient>, userId: string) {
    const { data, error } = await admin
        .from("portal_user_profiles")
        .select("user_id, full_name, level, group_name, active, created_at, updated_at")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        throw new HttpError("Could not load user profile: " + error.message, 500);
    }
    if (!data) {
        throw new HttpError("User profile not found. Refresh the user list and try again.", 404);
    }
    return data;
}

async function getUser(admin: ReturnType<typeof createClient>, userId: string) {
    const { data, error } = await admin.auth.admin.getUserById(userId);
    if (error || !data.user) {
        throw new HttpError("Could not find that portal user.", 404);
    }
    return data.user;
}

async function getStats(admin: ReturnType<typeof createClient>, userId: string) {
    const { data, error } = await admin
        .from("portal_user_time_stats")
        .select("time_entry_count, total_seconds, open_entries")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        throw new HttpError("Could not load user statistics: " + error.message, 500);
    }

    return data ?? { time_entry_count: 0, total_seconds: 0, open_entries: 0 };
}

async function inviteUser(admin: ReturnType<typeof createClient>, body: JsonObject) {
    const email = normalizeEmail(body.email);
    const fullName = normalizeText(body.fullName, "Full name", 120);
    const level = normalizeLevel(body.level);
    const groupName = normalizeGroup(body.groupName);
    const redirectTo = Deno.env.get("PORTAL_INVITE_REDIRECT_URL");

    if (!redirectTo) {
        throw new HttpError("The portal invitation redirect URL is not configured.", 503);
    }

    try {
        const redirectUrl = new URL(redirectTo);
        if (redirectUrl.protocol !== "https:" &&
            redirectUrl.hostname !== "localhost" &&
            redirectUrl.hostname !== "127.0.0.1") {
            throw new HttpError("The invitation redirect URL must use HTTPS.", 500);
        }
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        throw new HttpError("The portal invitation redirect URL is invalid.", 500);
    }

    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
        data: { full_name: fullName },
        redirectTo
    });

    if (error || !data.user) {
        throw new HttpError("Could not invite user: " + (error?.message ?? "No user was returned."), 400);
    }

    const { error: profileError } = await admin
        .from("portal_user_profiles")
        .insert({
            user_id: data.user.id,
            full_name: fullName,
            level,
            group_name: groupName,
            active: true
        });

    if (profileError) {
        const { error: rollbackError } = await admin.auth.admin.deleteUser(data.user.id);
        if (rollbackError) {
            throw new HttpError(
                "The profile could not be saved and the invited auth user could not be removed: " +
                    profileError.message + " " + rollbackError.message,
                500
            );
        }
        throw new HttpError("The profile could not be saved; the invitation was rolled back.", 500);
    }

    return { userId: data.user.id, email };
}

async function updateUser(
    admin: ReturnType<typeof createClient>,
    actorId: string,
    body: JsonObject
) {
    const userId = normalizeUserId(body.userId);
    const email = normalizeEmail(body.email);
    const fullName = normalizeText(body.fullName, "Full name", 120);
    const level = normalizeLevel(body.level);
    const groupName = normalizeGroup(body.groupName);

    if (typeof body.active !== "boolean") {
        throw new HttpError("Active status must be true or false.", 400);
    }
    const active = body.active;

    const currentUser = await getUser(admin, userId);
    await getProfile(admin, userId);

    if (userId === actorId && !active) {
        throw new HttpError("You cannot deactivate your own administrator account.", 400);
    }
    if (userId === actorId && email.toLowerCase() !== (currentUser.email ?? "").toLowerCase()) {
        throw new HttpError("You cannot change your own administrator email here.", 400);
    }

    const authAttributes: {
        email?: string;
        email_confirm?: boolean;
        user_metadata: Record<string, unknown>;
        ban_duration: string;
    } = {
        user_metadata: {
            ...(currentUser.user_metadata ?? {}),
            full_name: fullName
        },
        ban_duration: active ? "none" : "876000h"
    };

    if (email.toLowerCase() !== (currentUser.email ?? "").toLowerCase()) {
        authAttributes.email = email;
        authAttributes.email_confirm = true;
    }

    const { error: authError } = await admin.auth.admin.updateUserById(userId, authAttributes);
    if (authError) {
        throw new HttpError("Could not update auth account: " + authError.message, 400);
    }

    const { data: savedProfile, error: profileError } = await admin
        .from("portal_user_profiles")
        .update({
            full_name: fullName,
            level,
            group_name: groupName,
            active,
            updated_at: new Date().toISOString()
        })
        .eq("user_id", userId)
        .select("user_id")
        .maybeSingle();

    if (profileError || !savedProfile) {
        const profileErrorMessage =
            profileError?.message ?? "The user profile no longer exists.";
        const rollbackAttributes: {
            email?: string;
            email_confirm?: boolean;
            user_metadata: Record<string, unknown>;
            ban_duration: string;
        } = {
            user_metadata: currentUser.user_metadata ?? {},
            ban_duration: currentBanDuration(currentUser)
        };
        if (email.toLowerCase() !== (currentUser.email ?? "").toLowerCase() && currentUser.email) {
            rollbackAttributes.email = currentUser.email;
            rollbackAttributes.email_confirm = Boolean(currentUser.email_confirmed_at);
        }

        const { error: rollbackError } =
            await admin.auth.admin.updateUserById(userId, rollbackAttributes);

        if (rollbackError) {
            throw new HttpError(
                "Profile update failed and auth rollback failed: " +
                    profileErrorMessage + " " + rollbackError.message,
                500
            );
        }

        throw new HttpError("Could not save the profile; auth changes were rolled back.", 500);
    }

    const updatedUser = await getUser(admin, userId);
    const updatedProfile = await getProfile(admin, userId);
    const stats = await getStats(admin, userId);
    return {
        user: userSummary(updatedUser, updatedProfile, stats)
    };
}

async function userStats(admin: ReturnType<typeof createClient>, body: JsonObject) {
    const userId = normalizeUserId(body.userId);
    const [user, profile, stats] = await Promise.all([
        getUser(admin, userId),
        getProfile(admin, userId),
        getStats(admin, userId)
    ]);
    return { user: userSummary(user, profile, stats) };
}

async function timeSheet(admin: ReturnType<typeof createClient>, body: JsonObject) {
    const userId = normalizeUserId(body.userId);
    const [user, profile, stats, entriesResult] = await Promise.all([
        getUser(admin, userId),
        getProfile(admin, userId),
        getStats(admin, userId),
        admin
            .from("portal_time_entries")
            .select("id, user_id, clock_in, clock_out, created_by")
            .eq("user_id", userId)
            .order("clock_in", { ascending: false })
            .limit(500)
    ]);

    if (entriesResult.error) {
        throw new HttpError("Could not load the time sheet: " + entriesResult.error.message, 500);
    }

    return {
        user: userSummary(user, profile, stats),
        entries: entriesResult.data ?? []
    };
}

async function clockIn(
    admin: ReturnType<typeof createClient>,
    actorId: string,
    body: JsonObject
) {
    const userId = normalizeUserId(body.userId);
    await getProfile(admin, userId);

    const { data: openEntry, error: openError } = await admin
        .from("portal_time_entries")
        .select("id")
        .eq("user_id", userId)
        .is("clock_out", null)
        .maybeSingle();

    if (openError) {
        throw new HttpError("Could not check the user's current time entry: " + openError.message, 500);
    }
    if (openEntry) {
        throw new HttpError("This user already has an open time entry.", 409);
    }

    const { data, error } = await admin
        .from("portal_time_entries")
        .insert({ user_id: userId, created_by: actorId })
        .select("id, user_id, clock_in, clock_out, created_by")
        .single();

    if (error) {
        throw new HttpError("Could not start the time entry: " + error.message, 400);
    }
    return { entry: data };
}

async function clockOut(admin: ReturnType<typeof createClient>, body: JsonObject) {
    const userId = normalizeUserId(body.userId);
    await getProfile(admin, userId);

    const { data: openEntry, error: openError } = await admin
        .from("portal_time_entries")
        .select("id")
        .eq("user_id", userId)
        .is("clock_out", null)
        .maybeSingle();

    if (openError) {
        throw new HttpError("Could not check the user's current time entry: " + openError.message, 500);
    }
    if (!openEntry) {
        throw new HttpError("This user has no open time entry.", 409);
    }

    const { data, error } = await admin
        .from("portal_time_entries")
        .update({ clock_out: new Date().toISOString() })
        .eq("id", openEntry.id)
        .is("clock_out", null)
        .select("id, user_id, clock_in, clock_out, created_by")
        .maybeSingle();

    if (error) {
        throw new HttpError("Could not close the time entry: " + error.message, 400);
    }
    if (!data) {
        throw new HttpError("The time entry was already closed. Refresh the time sheet.", 409);
    }

    return { entry: data };
}

Deno.serve(async request => {
    if (request.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    if (request.method !== "POST") {
        return jsonResponse({ error: "Use POST for portal user administration." }, 405);
    }

    try {
        const url = Deno.env.get("SUPABASE_URL");
        if (!url) {
            throw new HttpError("The Supabase URL is not configured.", 500);
        }

        const admin = createClient(url, serviceKey(), {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        const authorization = request.headers.get("Authorization");
        const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
        if (!token) {
            throw new HttpError("Sign in to manage portal users.", 401);
        }

        const { data: authData, error: authError } = await admin.auth.getUser(token);
        if (authError || !authData.user?.email) {
            throw new HttpError("Your portal session is invalid or expired.", 401);
        }

        const allowedAdmins = (Deno.env.get("PORTAL_ADMIN_EMAILS") ?? "")
            .split(",")
            .map(email => email.trim().toLowerCase())
            .filter(Boolean);

        if (allowedAdmins.length === 0) {
            throw new HttpError("Portal user administrators are not configured.", 503);
        }
        if (!allowedAdmins.includes(authData.user.email.toLowerCase())) {
            throw new HttpError("Only an authorized portal administrator can manage users.", 403);
        }

        let body: JsonObject;
        try {
            const parsed = await request.json();
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                throw new Error("Expected an object.");
            }
            body = parsed as JsonObject;
        } catch {
            throw new HttpError("The request body must be valid JSON.", 400);
        }

        switch (body.action) {
            case "list":
                return jsonResponse({ users: await listUsers(admin) });
            case "invite":
                return jsonResponse(await inviteUser(admin, body), 201);
            case "update":
                return jsonResponse(
                    await updateUser(admin, authData.user.id, body)
                );
            case "stats":
                return jsonResponse(await userStats(admin, body));
            case "time-sheet":
                return jsonResponse(await timeSheet(admin, body));
            case "clock-in":
                return jsonResponse(await clockIn(admin, authData.user.id, body), 201);
            case "clock-out":
                return jsonResponse(await clockOut(admin, body));
            default:
                throw new HttpError("Unknown portal user action.", 400);
        }
    } catch (error) {
        if (error instanceof HttpError) {
            return jsonResponse({ error: error.message }, error.status);
        }

        console.error("Portal user administration failed:", error);
        return jsonResponse(
            {
                error: error instanceof Error
                    ? error.message
                    : "An unexpected user administration error occurred."
            },
            500
        );
    }
});

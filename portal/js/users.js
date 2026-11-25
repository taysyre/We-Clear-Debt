const userState = {
    users: [],
    mode: "users",
    previousMode: "users",
    formMode: "invite",
    selectedUser: null,
    currentUserId: null
};

const userMessage = document.getElementById("userMessage");
const userListPanel = document.getElementById("userListPanel");
const userFormPanel = document.getElementById("userFormPanel");
const userDetailsPanel = document.getElementById("userDetailsPanel");
const userTable = document.getElementById("usersTable");
const userTableBody = document.getElementById("usersTableBody");
const userStatusFilter = document.getElementById("userStatusFilter");
const userSearch = document.getElementById("userSearch");
const refreshUsersButton = document.getElementById("refreshUsers");
const userForm = document.getElementById("userForm");

function showMessage(message, type) {
    userMessage.textContent = message;
    userMessage.className = "users-message";
    if (type) {
        userMessage.classList.add("users-message-" + type);
    }
}

async function invokeAdmin(body) {
    const { data, error } = await supabaseClient.functions.invoke(
        "portal-user-admin",
        { body }
    );

    if (error) {
        let message = error.message || "The user-management request failed.";
        if (error.context && typeof error.context.clone === "function") {
            try {
                const responseBody = await error.context.clone().json();
                if (typeof responseBody.error === "string") {
                    message = responseBody.error;
                }
            } catch {
                // Keep the Functions SDK error when the response is not JSON.
            }
        }
        throw new Error(message);
    }

    if (!data || typeof data !== "object") {
        throw new Error("The user-management service returned an invalid response.");
    }

    return data;
}

function formatDate(value) {
    if (!value) {
        return "Never";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "Unknown"
        : new Intl.DateTimeFormat("en-ZA", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(date);
}

function formatHours(seconds) {
    const totalSeconds = Math.max(0, Number(seconds) || 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return hours + "h " + String(minutes).padStart(2, "0") + "m";
}

function updateGroupOptions() {
    const datalist = document.getElementById("userGroups");
    datalist.textContent = "";

    [...new Set(userState.users.map(user => user.group_name).filter(Boolean))]
        .sort((first, second) => first.localeCompare(second))
        .forEach(groupName => {
            const option = document.createElement("option");
            option.value = groupName;
            datalist.appendChild(option);
        });
}

function filteredUsers() {
    const query = userSearch.value.trim().toLowerCase();
    const status = userStatusFilter.value;

    return userState.users.filter(user => {
        const searchable = [
            user.id,
            user.email,
            user.full_name,
            user.group_name,
            user.level
        ].join(" ").toLowerCase();

        if (query && !searchable.includes(query)) {
            return false;
        }
        if (status === "active" && !user.active) {
            return false;
        }
        if (status === "inactive" && user.active) {
            return false;
        }
        return true;
    });
}

function makeCell(row, value, className) {
    const cell = document.createElement("td");
    cell.textContent = value == null ? "" : String(value);
    if (className) {
        cell.className = className;
    }
    row.appendChild(cell);
    return cell;
}

function makeButton(label, action, user, className) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className || "btn-secondary user-row-action";
    button.textContent = label;
    button.addEventListener("click", () => handleUserAction(action, user));
    return button;
}

function addActionsCell(row, user, actions) {
    const cell = document.createElement("td");
    cell.className = "user-actions-cell";
    const group = document.createElement("div");
    group.className = "user-row-actions";

    actions.forEach(([label, action]) => {
        group.appendChild(makeButton(label, action, user));
    });

    cell.appendChild(group);
    row.appendChild(cell);
}

function makeStatusBadge(user) {
    const badge = document.createElement("span");
    badge.className = user.active
        ? "user-status-badge user-status-active"
        : "user-status-badge user-status-inactive";
    badge.textContent = user.active ? "Active" : "Inactive";
    return badge;
}

function addStatusCell(row, user) {
    const cell = document.createElement("td");
    cell.appendChild(makeStatusBadge(user));
    row.appendChild(cell);
}

function createTableRow(user) {
    const row = document.createElement("tr");

    if (userState.mode === "stats") {
        makeCell(row, user.full_name);
        makeCell(row, user.email);
        makeCell(row, formatDate(user.created_at));
        makeCell(row, formatDate(user.last_sign_in_at));
        makeCell(row, user.time_entry_count);
        makeCell(row, formatHours(user.total_seconds));
        addActionsCell(row, user, [["Open Stats", "stats"]]);
        return row;
    }

    if (userState.mode === "status") {
        makeCell(row, user.full_name);
        makeCell(row, user.email);
        makeCell(row, user.group_name || "—");
        addStatusCell(row, user);
        makeCell(row, formatDate(user.last_sign_in_at));
        addActionsCell(row, user, [["Manage Status", "status"]]);
        return row;
    }

    if (userState.mode === "time-sheet") {
        makeCell(row, user.full_name);
        makeCell(row, user.email);
        makeCell(row, user.group_name || "—");
        addStatusCell(row, user);
        makeCell(row, user.time_entry_count);
        makeCell(row, formatHours(user.total_seconds));
        addActionsCell(row, user, [["Open Time Sheet", "time-sheet"]]);
        return row;
    }

    const idCell = makeCell(row, user.id.slice(0, 8));
    idCell.title = user.id;
    makeCell(row, user.full_name);
    makeCell(row, user.level);
    makeCell(row, user.group_name || "—");
    addStatusCell(row, user);
    addActionsCell(row, user, [["Modify", "modify"]]);
    addActionsCell(row, user, [["Stats", "stats"]]);
    addActionsCell(row, user, [["Status", "status"]]);
    addActionsCell(row, user, [["Time", "time-sheet"]]);
    return row;
}

function renderUsers() {
    const records = filteredUsers();
    const headersByMode = {
        users: ["USER ID", "FULL NAME", "LEVEL", "GROUP", "ACTIVE", "MODIFY", "STATS", "STATUS", "TIME"],
        stats: ["FULL NAME", "EMAIL", "CREATED", "LAST SIGN IN", "TIME ENTRIES", "TIME TOTAL", "DETAILS"],
        status: ["FULL NAME", "EMAIL", "GROUP", "ACTIVE", "LAST SIGN IN", "STATUS"],
        "time-sheet": ["FULL NAME", "EMAIL", "GROUP", "ACTIVE", "TIME ENTRIES", "TIME TOTAL", "TIME SHEET"]
    };

    userTableBody.textContent = "";

    const headerRow = document.createElement("tr");
    headersByMode[userState.mode].forEach(label => {
        const heading = document.createElement("th");
        heading.scope = "col";
        heading.textContent = label;
        headerRow.appendChild(heading);
    });

    const header = document.createElement("thead");
    header.id = "usersTableHead";
    header.appendChild(headerRow);
    const previousHeader = userTable.querySelector("thead");
    if (previousHeader) {
        previousHeader.replaceWith(header);
    } else {
        userTable.insertBefore(header, userTableBody);
    }

    if (records.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = headersByMode[userState.mode].length;
        cell.className = "user-empty";
        cell.textContent = userState.users.length === 0
            ? "No portal users are available."
            : "No users match the selected search and filters.";
        row.appendChild(cell);
        userTableBody.appendChild(row);
    } else {
        records.forEach(user => userTableBody.appendChild(createTableRow(user)));
    }

    document.getElementById("usersCount").textContent =
        records.length === userState.users.length
            ? userState.users.length + (userState.users.length === 1 ? " user" : " users")
            : records.length + " of " + userState.users.length + " users";
}

function setUserView(mode) {
    userState.mode = mode;
    userListPanel.hidden = false;
    userFormPanel.hidden = true;
    userDetailsPanel.hidden = true;

    const titles = {
        users: ["User Listings", "Manage portal accounts and access."],
        stats: ["User Stats", "Account and recorded time statistics."],
        status: ["User Status", "Review and update account access."],
        "time-sheet": ["Time Sheet", "Review recorded time by portal user."]
    };

    document.getElementById("userListTitle").textContent = titles[mode][0];
    document.getElementById("userListDescription").textContent = titles[mode][1];
    setActiveUserNav(mode);
    renderUsers();
}

function setActiveUserNav(mode) {
    document.querySelectorAll("[data-user-nav]").forEach(button => {
        button.classList.toggle("users-subnav-active", button.dataset.userNav === mode);
    });
}

function updateCopySourceOptions() {
    const select = document.getElementById("copySource");
    select.textContent = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose a user";
    select.appendChild(placeholder);

    userState.users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.full_name + " (" + user.email + ")";
        select.appendChild(option);
    });
}

function showUserForm(mode, user) {
    userState.formMode = mode;
    userState.selectedUser = user ?? null;
    userListPanel.hidden = true;
    userDetailsPanel.hidden = true;
    userFormPanel.hidden = false;
    userForm.reset();
    document.getElementById("copySourceField").hidden = mode !== "copy";
    document.getElementById("userFormTitle").textContent =
        mode === "modify"
            ? "Modify User"
            : mode === "copy"
                ? "Copy User"
                : "Add A New User";
    document.getElementById("userFormDescription").textContent =
        mode === "modify"
            ? "Update account details and access."
            : "A portal invitation will be sent to the new user's email address.";
    document.getElementById("saveUser").textContent =
        mode === "modify" ? "Save Changes" : "Send Invitation";
    document.getElementById("userFormNote").textContent =
        mode === "modify"
            ? "Deactivating an account blocks future sign-ins. You cannot deactivate or change the email of your own administrator account."
            : "The invitation link directs the user to the portal sign-in page.";

    const emailInput = document.getElementById("email");
    const activeInput = document.getElementById("userActive");
    emailInput.disabled =
        mode === "modify" && user.id === userState.currentUserId;
    activeInput.disabled = mode !== "modify";
    setActiveUserNav(
        mode === "invite"
            ? "add"
            : mode === "modify"
                ? userState.mode
                : mode
    );

    if (mode === "modify" && user) {
        document.getElementById("fullName").value = user.full_name;
        emailInput.value = user.email;
        document.getElementById("userLevel").value = String(user.level);
        document.getElementById("groupName").value = user.group_name;
        activeInput.checked = user.active;
    } else {
        activeInput.checked = true;
        if (mode === "copy") {
            updateCopySourceOptions();
        }
    }
}

function renderInfoGrid(items) {
    const grid = document.createElement("div");
    grid.className = "user-info-grid";

    items.forEach(([label, value]) => {
        const card = document.createElement("div");
        card.className = "user-info-card";
        const labelElement = document.createElement("span");
        labelElement.textContent = label;
        const valueElement = document.createElement("strong");
        valueElement.textContent = value == null || value === "" ? "—" : String(value);
        card.append(labelElement, valueElement);
        grid.appendChild(card);
    });
    return grid;
}

function renderDetailsHeader(user, view) {
    userState.selectedUser = user;
    userState.previousMode = userState.mode;
    userListPanel.hidden = true;
    userFormPanel.hidden = true;
    userDetailsPanel.hidden = false;
    setActiveUserNav(view);
    document.getElementById("userDetailsTitle").textContent =
        view === "stats"
            ? "User Stats — " + user.full_name
            : view === "status"
                ? "User Status — " + user.full_name
                : "Time Sheet — " + user.full_name;
    document.getElementById("userDetailsDescription").textContent =
        user.email + " · " + (user.group_name || "No group");
    document.getElementById("userDetailsContent").textContent = "";
}

async function showUserDetails(user, view) {
    renderDetailsHeader(user, view);
    showMessage("", "");

    try {
        if (view === "stats") {
            const result = await invokeAdmin({ action: "stats", userId: user.id });
            const current = result.user;
            userState.selectedUser = current;
            document.getElementById("userDetailsContent").appendChild(renderInfoGrid([
                ["User ID", current.id],
                ["Email", current.email],
                ["Level", current.level],
                ["Group", current.group_name || "No group"],
                ["Account created", formatDate(current.created_at)],
                ["Last sign in", formatDate(current.last_sign_in_at)],
                ["Time entries", current.time_entry_count],
                ["Total recorded time", formatHours(current.total_seconds)]
            ]));
            return;
        }

        if (view === "status") {
            const content = document.getElementById("userDetailsContent");
            content.appendChild(renderInfoGrid([
                ["Email", user.email],
                ["Level", user.level],
                ["Group", user.group_name || "No group"],
                ["Current status", user.active ? "Active" : "Inactive"],
                ["Last sign in", formatDate(user.last_sign_in_at)]
            ]));

            const action = document.createElement("div");
            action.className = "user-detail-actions";
            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = user.active ? "btn-danger" : "btn-primary";
            toggle.textContent = user.active ? "Deactivate User" : "Activate User";
            toggle.disabled = user.id === userState.currentUserId && user.active;
            toggle.addEventListener("click", () => updateUserStatus(user, !user.active));
            action.appendChild(toggle);
            content.appendChild(action);
            return;
        }

        await renderTimeSheet(user);
    } catch (error) {
        showMessage(error.message, "error");
    }
}

async function renderTimeSheet(user) {
    const result = await invokeAdmin({ action: "time-sheet", userId: user.id });
    const current = result.user;
    userState.selectedUser = current;
    const content = document.getElementById("userDetailsContent");

    content.appendChild(renderInfoGrid([
        ["Total entries", current.time_entry_count],
        ["Total time", formatHours(current.total_seconds)],
        ["Open entries", current.open_entries]
    ]));

    const openEntry = result.entries.find(entry => !entry.clock_out);
    const controls = document.createElement("div");
    controls.className = "user-detail-actions";
    const clockButton = document.createElement("button");
    clockButton.type = "button";
    clockButton.className = openEntry ? "btn-danger" : "btn-primary";
    clockButton.textContent = openEntry ? "Clock Out" : "Clock In";
    clockButton.addEventListener("click", async () => {
        clockButton.disabled = true;
        try {
            await invokeAdmin({
                action: openEntry ? "clock-out" : "clock-in",
                userId: current.id
            });
            await loadUsers();
            await showUserDetails(
                userState.users.find(item => item.id === current.id) ?? current,
                "time-sheet"
            );
            showMessage(openEntry ? "Time entry closed." : "Time entry started.", "success");
        } catch (error) {
            clockButton.disabled = false;
            showMessage(error.message, "error");
        }
    });
    controls.appendChild(clockButton);
    content.appendChild(controls);

    const tableCard = document.createElement("div");
    tableCard.className = "table-card user-time-table-card";
    const table = document.createElement("table");
    const headings = ["CLOCK IN", "CLOCK OUT", "DURATION"];
    const head = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headings.forEach(label => {
        const cell = document.createElement("th");
        cell.scope = "col";
        cell.textContent = label;
        headerRow.appendChild(cell);
    });
    head.appendChild(headerRow);
    table.appendChild(head);

    const body = document.createElement("tbody");
    if (result.entries.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = headings.length;
        cell.className = "user-empty";
        cell.textContent = "No time entries have been recorded.";
        row.appendChild(cell);
        body.appendChild(row);
    } else {
        result.entries.forEach(entry => {
            const row = document.createElement("tr");
            const endTime = entry.clock_out ? new Date(entry.clock_out) : new Date();
            const startTime = new Date(entry.clock_in);
            const seconds = Number.isNaN(startTime.getTime())
                ? 0
                : Math.max(0, Math.floor((endTime.getTime() - startTime.getTime()) / 1000));
            [
                formatDate(entry.clock_in),
                entry.clock_out ? formatDate(entry.clock_out) : "In progress",
                formatHours(seconds)
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });
            body.appendChild(row);
        });
    }

    table.appendChild(body);
    tableCard.appendChild(table);
    content.appendChild(tableCard);
}

async function updateUserStatus(user, active) {
    try {
        const result = await invokeAdmin({
            action: "update",
            userId: user.id,
            email: user.email,
            fullName: user.full_name,
            level: user.level,
            groupName: user.group_name,
            active
        });
        await loadUsers();
        const updated = result.user;
        await showUserDetails(updated, "status");
        showMessage(active ? "User activated." : "User deactivated.", "success");
    } catch (error) {
        showMessage(error.message, "error");
    }
}

async function handleUserAction(action, user) {
    if (action === "modify") {
        showUserForm("modify", user);
        return;
    }
    await showUserDetails(user, action);
}

async function loadUsers() {
    const result = await invokeAdmin({ action: "list" });
    if (!Array.isArray(result.users)) {
        throw new Error("The user-management service returned an invalid user list.");
    }

    userState.users = result.users;
    updateGroupOptions();
    renderUsers();
}

function cancelUserAction() {
    userListPanel.hidden = true;
    userFormPanel.hidden = true;
    userDetailsPanel.hidden = true;
    setUserView(userState.previousMode);
}

document.querySelectorAll("[data-user-nav]").forEach(button => {
    button.addEventListener("click", () => {
        const view = button.dataset.userNav;
        if (view === "add") {
            userState.previousMode = userState.mode;
            showUserForm("invite");
        } else if (view === "copy") {
            userState.previousMode = userState.mode;
            showUserForm("copy");
        } else if (view === "search") {
            setUserView("users");
            setActiveUserNav("search");
            userSearch.focus();
        } else {
            userState.previousMode = view;
            setUserView(view);
        }
    });
});

document.querySelectorAll("[data-user-cancel]").forEach(button => {
    button.addEventListener("click", cancelUserAction);
});

document.getElementById("copySource").addEventListener("change", event => {
    const source = userState.users.find(user => user.id === event.target.value);
    if (!source) {
        return;
    }

    document.getElementById("fullName").value = source.full_name + " Copy";
    document.getElementById("userLevel").value = String(source.level);
    document.getElementById("groupName").value = source.group_name;
    document.getElementById("userActive").checked = true;
    document.getElementById("email").value = "";
});

userForm.addEventListener("submit", async event => {
    event.preventDefault();
    const submitButton = document.getElementById("saveUser");
    submitButton.disabled = true;
    showMessage("", "");

    const payload = {
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        level: Number(document.getElementById("userLevel").value),
        groupName: document.getElementById("groupName").value.trim()
    };

    try {
        if (userState.formMode === "modify") {
            await invokeAdmin({
                action: "update",
                userId: userState.selectedUser.id,
                ...payload,
                active: document.getElementById("userActive").checked
            });
            showMessage("User details updated.", "success");
            await loadUsers();
            setUserView(userState.previousMode);
        } else {
            await invokeAdmin({ action: "invite", ...payload });
            showMessage("Invitation sent to " + payload.email + ".", "success");
            await loadUsers();
            setUserView("users");
        }
    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        submitButton.disabled = false;
    }
});

userSearch.addEventListener("input", renderUsers);
userStatusFilter.addEventListener("change", renderUsers);

document.getElementById("showAllUsers").addEventListener("click", () => {
    userSearch.value = "";
    userStatusFilter.value = "all";
    setUserView("users");
});

refreshUsersButton.addEventListener("click", async () => {
    refreshUsersButton.disabled = true;
    try {
        await loadUsers();
        showMessage("User list refreshed.", "success");
    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        refreshUsersButton.disabled = false;
    }
});

document.getElementById("logoutBtn").addEventListener("click", async event => {
    event.preventDefault();
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        showMessage("Unable to log out: " + error.message, "error");
        return;
    }
    window.location.href = "login.html";
});

async function initUsers() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
        showMessage("Unable to verify portal access: " + error.message, "error");
        return;
    }
    if (!data.session) {
        window.location.href = "login.html";
        return;
    }

    userState.currentUserId = data.session.user.id;
    document.getElementById("userEmail").textContent = data.session.user.email || "";

    try {
        await loadUsers();
    } catch (loadError) {
        showMessage(loadError.message, "error");
    }
}

initUsers();

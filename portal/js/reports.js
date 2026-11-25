const reportGroups = [
    {
        column: 0,
        title: "Real-Time Reports",
        reports: [
            {
                label: "VERM - Enhanced Reporting Module",
                unavailable: "No call-center reporting system is connected."
            },
            {
                id: "real-time-main",
                label: "Real-Time Main Report",
                description: "All current CRM leads and clients with live status, contact, debt, and creation-date details."
            },
            {
                label: "Real-Time Campaign Summary",
                unavailable: "Campaign tracking data is not stored in the CRM."
            },
            {
                id: "whiteboard",
                label: "Real-Time Whiteboard Report",
                description: "A live breakdown of CRM records by current status."
            }
        ]
    },
    {
        column: 0,
        title: "Inbound and Outbound Calling Reports",
        reports: [
            { label: "VERM - Enhanced Reporting Module", unavailable: "No call-center reporting system is connected." },
            { label: "Inbound Report - v2", unavailable: "Call records are not stored in the CRM." },
            { label: "Inbound Report by DID", unavailable: "Call records and DID assignments are not stored in the CRM." },
            { label: "Inbound Service Level Report", unavailable: "Call arrival and answer-time data is not available." },
            { label: "Inbound Summary Hourly Report", unavailable: "Call timestamps are not stored in the CRM." },
            { label: "Inbound Daily Report", unavailable: "Call records are not stored in the CRM." },
            { label: "Inbound DID Report - DID Summary - Agent DID", unavailable: "Call records, DIDs, and agent assignments are not stored in the CRM." },
            { label: "Inbound IVR Report", unavailable: "IVR activity is not stored in the CRM." },
            { label: "Inbound Forecasting Report - Advanced", unavailable: "Call-volume history is not available for forecasting." },
            { label: "Outbound Calling Report", unavailable: "Call records are not stored in the CRM." },
            { label: "Outbound Summary Interval Report", unavailable: "Call timestamps and durations are not stored in the CRM." },
            { label: "Outbound IVR Report - Export - Callmenu Agent", unavailable: "IVR activity and agent assignments are not stored in the CRM." },
            { label: "Outbound Lead Source Report", unavailable: "Outbound call and lead-source tracking is not available." },
            { label: "Fronter - Closer Report - Detail", unavailable: "Call outcomes and agent assignments are not stored in the CRM." },
            { label: "Lists Pass Report", unavailable: "Dialing-list activity is not stored in the CRM." },
            { label: "Lists Campaign Statuses Report", unavailable: "Campaign status data is not stored in the CRM." },
            { label: "Called Counts List IDs Report", unavailable: "Call counts and list IDs are not stored in the CRM." },
            { label: "Campaign Status List Report", unavailable: "Campaign status data is not stored in the CRM." },
            { label: "Export Calls Report", unavailable: "Call records are not stored in the CRM." },
            {
                id: "export-leads",
                label: "Export Leads Report",
                description: "Download filtered CRM leads and clients as a CSV file."
            }
        ]
    },
    {
        column: 1,
        title: "Agent Reports",
        reports: [
            { label: "VERM - Enhanced Reporting Module", unavailable: "No agent reporting system is connected." },
            { label: "Agent Time Detail", unavailable: "Agent time records are not stored in the CRM." },
            { label: "Agent Status Detail - Inbound Summary", unavailable: "Agent status and inbound call data are not stored in the CRM." },
            { label: "Agent Performance Detail", unavailable: "Agent assignments and call outcomes are not stored in the CRM." },
            { label: "Team Performance Detail", unavailable: "Team assignments and performance data are not stored in the CRM." },
            { label: "Performance Comparison Report", unavailable: "Agent performance history is not stored in the CRM." },
            { label: "Single Agent Daily - Time", unavailable: "Agent time records are not stored in the CRM." },
            { label: "User Group Login Report", unavailable: "User-group login history is not available." },
            { label: "User Group Hourly Report - v2", unavailable: "User-group activity history is not available." },
            { label: "User Stats", unavailable: "Portal user activity metrics are not available." },
            { label: "User Time Sheet", unavailable: "Timesheet data is not stored in the CRM." }
        ]
    },
    {
        column: 1,
        title: "Time Clock Reports",
        reports: [
            { label: "User Timeclock Report", unavailable: "Timeclock records are not stored in the CRM." },
            { label: "User Group Timeclock Status Report", unavailable: "Timeclock records and user groups are not stored in the CRM." },
            { label: "User Timeclock Detail Report", unavailable: "Timeclock records are not stored in the CRM." }
        ]
    },
    {
        column: 1,
        title: "Other Reports and Links",
        reports: [
            { label: "Server Performance Report", unavailable: "This portal has no server-monitoring data source." },
            { label: "Maximum System Stats", unavailable: "This portal has no server or telephony monitoring data source." }
        ]
    }
];

const pageSize = 1000;
const clients = [];
let selectedReport = null;
let visibleClients = [];
let recordsLoaded = false;

const reportCatalog = document.getElementById("reportCatalog");
const reportTitle = document.getElementById("reportTitle");
const reportDescription = document.getElementById("reportDescription");
const reportMessage = document.getElementById("reportMessage");
const reportMetrics = document.getElementById("reportMetrics");
const reportWhiteboard = document.getElementById("reportWhiteboard");
const reportTable = document.getElementById("reportTable");
const exportButton = document.getElementById("exportReport");
const printButton = document.getElementById("printReport");
const refreshButton = document.getElementById("refreshReport");
const statusFilter = document.getElementById("statusFilter");

function showMessage(message, type) {
    reportMessage.textContent = message;
    reportMessage.className = "report-message";
    if (type) {
        reportMessage.classList.add("report-message-" + type);
    }
}

function renderCatalog() {
    reportCatalog.textContent = "";

    [0, 1].forEach(columnIndex => {
        const column = document.createElement("div");
        column.className = "report-column";

        reportGroups
            .filter(group => group.column === columnIndex)
            .forEach(group => {
                const section = document.createElement("section");
                section.className = "report-group";

                const heading = document.createElement("h3");
                heading.textContent = group.title;
                section.appendChild(heading);

                const list = document.createElement("ul");
                group.reports.forEach(report => {
                    const item = document.createElement("li");
                    const button = document.createElement("button");
                    button.type = "button";
                    button.textContent = report.label;

                    if (report.id) {
                        button.className = "report-link";
                        button.addEventListener("click", () => selectReport(report));
                    } else {
                        button.className = "report-link report-link-unavailable";
                        button.disabled = true;
                        button.title = report.unavailable;

                        const note = document.createElement("span");
                        note.className = "report-item-note";
                        note.textContent = report.unavailable;
                        item.append(button, note);
                    }

                    if (report.id) {
                        item.appendChild(button);
                    }
                    list.appendChild(item);
                });

                section.appendChild(list);
                column.appendChild(section);
            });

        reportCatalog.appendChild(column);
    });
}

function selectReport(report) {
    selectedReport = report;
    reportTitle.textContent = report.label;
    reportDescription.textContent = report.description;

    reportCatalog.querySelectorAll(".report-link-active").forEach(button => {
        button.classList.remove("report-link-active");
    });

    const buttons = reportCatalog.querySelectorAll(".report-link");
    buttons.forEach(button => {
        if (button.textContent === report.label && !button.disabled) {
            button.classList.add("report-link-active");
        }
    });

    renderReport();
}

async function loadClients() {
    const loadedClients = [];
    let offset = 0;

    while (true) {
        const { data, error } = await supabaseClient
            .from("clients")
            .select("*")
            .order("created_at", { ascending: false })
            .range(offset, offset + pageSize - 1);

        if (error) {
            showMessage("Unable to load CRM reports: " + error.message, "error");
            return false;
        }

        loadedClients.push(...(data || []));

        if (!data || data.length < pageSize) {
            clients.length = 0;
            loadedClients.forEach(client => clients.push(client));
            return true;
        }

        offset += pageSize;
    }
}

function populateStatusFilter(previousStatus) {
    const selectedStatus = previousStatus || statusFilter.value;
    statusFilter.textContent = "";

    const allStatuses = document.createElement("option");
    allStatuses.value = "";
    allStatuses.textContent = "All statuses";
    statusFilter.appendChild(allStatuses);

    const statuses = [...new Set(
        clients.map(client => String(client.status || "").trim()).filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));

    statuses.forEach(status => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        statusFilter.appendChild(option);
    });

    if (statuses.includes(selectedStatus)) {
        statusFilter.value = selectedStatus;
    }
}

function dateValue(value) {
    if (!value) {
        return "";
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toISOString().slice(0, 10);
}

function getFilteredClients() {
    const from = document.getElementById("dateFrom").value;
    const to = document.getElementById("dateTo").value;

    if (from && to && from > to) {
        showMessage("The start date must be on or before the end date.", "error");
        return null;
    }

    const status = statusFilter.value;
    const search = document.getElementById("reportSearch").value.trim().toLowerCase();

    return clients.filter(client => {
        const createdDate = dateValue(client.created_at);
        const clientStatus = String(client.status || "");
        const searchableText = [
            client.full_name,
            client.email,
            client.phone
        ].join(" ").toLowerCase();

        if (from && (!createdDate || createdDate < from)) {
            return false;
        }

        if (to && (!createdDate || createdDate > to)) {
            return false;
        }

        if (status && clientStatus !== status) {
            return false;
        }

        return !search || searchableText.includes(search);
    });
}

function formatCurrency(value) {
    const amount = Number(value);
    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0
    }).format(Number.isFinite(amount) ? amount : 0);
}

function formatDate(value) {
    const parsedDate = new Date(value);
    return value && !Number.isNaN(parsedDate.getTime())
        ? new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(parsedDate)
        : "—";
}

function appendMetric(container, label, value) {
    const card = document.createElement("div");
    card.className = "report-metric-card";

    const valueElement = document.createElement("strong");
    valueElement.textContent = value;

    const labelElement = document.createElement("span");
    labelElement.textContent = label;

    card.append(valueElement, labelElement);
    container.appendChild(card);
}

function renderMetrics(records) {
    reportMetrics.textContent = "";
    const totalDebt = records.reduce((sum, client) => {
        const debt = Number(client.debt_amount);
        return sum + (Number.isFinite(debt) ? debt : 0);
    }, 0);

    appendMetric(reportMetrics, "Matching records", String(records.length));
    appendMetric(reportMetrics, "New leads", String(records.filter(client => client.status === "New Lead").length));
    appendMetric(reportMetrics, "Completed", String(records.filter(client => client.status === "Completed").length));
    appendMetric(reportMetrics, "Total recorded debt", formatCurrency(totalDebt));
}

function renderWhiteboard(records) {
    reportWhiteboard.textContent = "";
    if (!selectedReport || selectedReport.id !== "whiteboard") {
        return;
    }

    const counts = new Map();
    records.forEach(client => {
        const status = String(client.status || "No status");
        counts.set(status, (counts.get(status) || 0) + 1);
    });

    if (counts.size === 0) {
        return;
    }

    [...counts.entries()]
        .sort(([first], [second]) => first.localeCompare(second))
        .forEach(([status, count]) => appendMetric(reportWhiteboard, status, String(count)));
}

function renderTable(records) {
    reportTable.textContent = "";

    const table = document.createElement("table");
    const headings = ["Name", "Phone", "Email", "Debt", "Status", "Created"];
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
    if (records.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = headings.length;
        cell.className = "report-empty";
        cell.textContent = "No CRM records match the selected filters.";
        row.appendChild(cell);
        body.appendChild(row);
    } else {
        records.forEach(client => {
            const row = document.createElement("tr");
            [
                client.full_name || "—",
                client.phone || "—",
                client.email || "—",
                formatCurrency(client.debt_amount),
                client.status || "No status",
                formatDate(client.created_at)
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = String(value);
                row.appendChild(cell);
            });
            body.appendChild(row);
        });
    }

    table.appendChild(body);
    reportTable.appendChild(table);
}

function renderSystemSummary() {
    const summary = document.getElementById("systemSummary");
    summary.textContent = "";
    [
        ["CRM data source", "Connected"],
        ["Client records loaded", String(clients.length)],
        ["Call / timeclock data", "Not connected"],
        ["Last refreshed", new Date().toLocaleString()]
    ].forEach(([label, value]) => {
        const item = document.createElement("div");
        item.className = "report-system-item";

        const labelElement = document.createElement("span");
        labelElement.textContent = label;

        const valueElement = document.createElement("strong");
        valueElement.textContent = value;

        item.append(labelElement, valueElement);
        summary.appendChild(item);
    });
}

function renderReport() {
    if (!recordsLoaded || !selectedReport) {
        return;
    }

    const records = getFilteredClients();
    if (records === null) {
        visibleClients = [];
        reportMetrics.textContent = "";
        reportWhiteboard.textContent = "";
        reportTable.textContent = "";
        exportButton.disabled = true;
        printButton.disabled = true;
        return;
    }

    visibleClients = records;
    showMessage(
        records.length === 1
            ? "Showing 1 CRM record."
            : "Showing " + records.length + " CRM records.",
        "success"
    );
    renderMetrics(records);
    renderWhiteboard(records);
    renderTable(records);
    exportButton.disabled = false;
    printButton.disabled = false;
}

function csvCell(value) {
    let text = String(value ?? "");
    if (/^[=+\-@]/.test(text)) {
        text = "'" + text;
    }
    return '"' + text.replace(/"/g, '""') + '"';
}

function exportCsv() {
    if (!selectedReport || !recordsLoaded) {
        return;
    }

    const headers = ["Name", "Phone", "Email", "Debt Amount (ZAR)", "Status", "Created"];
    const rows = visibleClients.map(client => [
        client.full_name,
        client.phone,
        client.email,
        client.debt_amount,
        client.status,
        client.created_at
    ]);
    const csv = [headers, ...rows]
        .map(row => row.map(csvCell).join(","))
        .join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = (selectedReport.id === "export-leads" ? "crm-leads" : "crm-report") + ".csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function clearFilters() {
    document.getElementById("dateFrom").value = "";
    document.getElementById("dateTo").value = "";
    statusFilter.value = "";
    document.getElementById("reportSearch").value = "";
    renderReport();
}

document.getElementById("logoutBtn").addEventListener("click", async event => {
    event.preventDefault();
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        showMessage("Unable to log out: " + error.message, "error");
        return;
    }
    window.location.href = "login.html";
});

["dateFrom", "dateTo", "statusFilter", "reportSearch"].forEach(id => {
    const element = document.getElementById(id);
    element.addEventListener(
        element.type === "search" ? "input" : "change",
        renderReport
    );
});

document.getElementById("clearFilters").addEventListener("click", clearFilters);
exportButton.addEventListener("click", exportCsv);
printButton.addEventListener("click", () => window.print());

async function initReports() {
    renderCatalog();

    const { data: sessionData, error: sessionError } =
        await supabaseClient.auth.getSession();

    if (sessionError) {
        showMessage("Unable to verify portal access: " + sessionError.message, "error");
        return;
    }

    if (!sessionData.session) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("userEmail").textContent =
        sessionData.session.user.email || "";

    refreshButton.disabled = false;
    const loaded = await loadClients();
    if (!loaded) {
        return;
    }

    recordsLoaded = true;
    populateStatusFilter();
    renderSystemSummary();
    selectReport(reportGroups[0].reports.find(report => report.id === "real-time-main"));
}

async function refreshData() {
    refreshButton.disabled = true;
    showMessage("Refreshing CRM reports...", "");

    try {
        const loaded = await loadClients();
        if (!loaded) {
            return;
        }

        recordsLoaded = true;
        populateStatusFilter(statusFilter.value);
        renderSystemSummary();
        renderReport();
    } catch (error) {
        showMessage(
            "Unable to refresh CRM reports: " +
                (error instanceof Error ? error.message : String(error)),
            "error"
        );
    } finally {
        refreshButton.disabled = false;
    }
}

refreshButton.addEventListener("click", refreshData);

initReports();

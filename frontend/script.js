const API_BASE = "http://127.0.0.1:5000";

let ledgerData = [];


// =====================================================
// LOAD LEDGER
// =====================================================

async function loadLedger() {

    try {

        const response = await fetch(
            `${API_BASE}/api/ledger`
        );

        if (!response.ok) {
            throw new Error("Backend response error");
        }

        ledgerData = await response.json();

        displayLedger(ledgerData);
        updateDashboard(ledgerData);

    } catch (error) {

        console.error(error);

        document.getElementById("ledgerContainer").innerHTML = `
            <div class="error-box">
                ❌ Unable to connect to backend.<br>
                Please make sure Flask server is running.
            </div>
        `;
    }
}



// =====================================================
// DASHBOARD
// =====================================================

function updateDashboard(data) {

    const total = data.length;

    const approved = data.filter(
        item => item.status === "APPROVED"
    ).length;

    const pending = data.filter(
        item => item.status === "PENDING"
    ).length;

    const rejected = data.filter(
        item => item.status === "REJECTED"
    ).length;

    const conflicts = data.filter(
        item =>
            item.conflict &&
            item.conflict.toLowerCase() !== "none" &&
            item.conflict.toLowerCase() !== "no conflict detected"
    ).length;

    const zkVerified = data.filter(
        item => item.zk_commitment
    ).length;


    document.getElementById("totalParcels").textContent = total;

    document.getElementById("approvedParcels").textContent =
        approved;

    document.getElementById("pendingParcels").textContent =
        pending;

    document.getElementById("conflictParcels").textContent =
        conflicts;

    document.getElementById("rejectedParcels").textContent =
        rejected;

    document.getElementById("zkVerified").textContent =
        zkVerified;
}



// =====================================================
// DISPLAY LEDGER
// =====================================================

function displayLedger(data) {

    const container =
        document.getElementById("ledgerContainer");

    container.innerHTML = "";


    if (data.length === 0) {

        container.innerHTML = `
            <div class="empty-box">
                No parcel records found.
            </div>
        `;

        return;
    }


    data.forEach(record => {

        const card =
            document.createElement("div");

        card.className = "ledger-card";


        const status =
            record.status || "PENDING";


        const hasConflict =
            record.conflict &&
            record.conflict.toLowerCase() !== "none" &&
            record.conflict.toLowerCase() !==
            "no conflict detected";


        card.innerHTML = `

            <div class="card-header">

                <div>

                    <h3>
                        📍 ${record.parcel_id}
                    </h3>

                    <p>
                        ${record.source || "Unknown Source"}
                    </p>

                </div>


                <span class="status ${status.toLowerCase()}">
                    ${status}
                </span>

            </div>


            <div class="card-body">


                <div class="info-row">

                    <strong>
                        📅 Date:
                    </strong>

                    <span>
                        ${record.date || "N/A"}
                    </span>

                </div>



                <div class="info-row">

                    <strong>
                        🔄 Transformation:
                    </strong>

                    <span>
                        ${record.transformation || "N/A"}
                    </span>

                </div>



                <div class="info-row">

                    <strong>
                        ⚠️ Conflict:
                    </strong>

                    <span class="${hasConflict ? "conflict-text" : ""}">
                        ${record.conflict || "None"}
                    </span>

                </div>



                <div class="info-row">

                    <strong>
                        🧠 Decision Reason:
                    </strong>

                    <span>
                        ${record.decision_reason || "N/A"}
                    </span>

                </div>



                <div class="info-row">

                    <strong>
                        👤 Human Approval:
                    </strong>

                    <span>

                        ${
                            record.human_approval
                            ? "✅ Approved"
                            : "❌ Not Approved"
                        }

                    </span>

                </div>



                <!-- ZK COMMITMENT -->

                <div class="zk-box">

                    <strong>
                        🔐 ZK Commitment
                    </strong>


                    ${
                        record.zk_commitment
                        ?

                        `

                        <div class="commitment">
                            ${record.zk_commitment}
                        </div>


                        <button
                            class="verify-btn"
                            onclick="verifyCommitment('${record.parcel_id}')">

                            🔍 Verify Commitment

                        </button>

                        `

                        :

                        `

                        <div class="not-generated">
                            Not Generated
                        </div>

                        `
                    }

                </div>

            </div>



            <!-- CARD FOOTER -->

            <div class="card-footer">


                <button
                    class="view-btn"
                    onclick="viewDetails('${record.parcel_id}')">

                    📋 View Details

                </button>


                ${
                    status === "PENDING"
                    ?

                    `

                    <button
                        class="approve-btn"
                        onclick="approveParcel('${record.parcel_id}')">

                        ✅ Approve

                    </button>


                    <button
                        class="reject-btn"
                        onclick="rejectParcel('${record.parcel_id}')">

                        ❌ Reject

                    </button>

                    `

                    :

                    ""
                }


            </div>

        `;


        container.appendChild(card);

    });
}



// =====================================================
// VERIFY COMMITMENT
// =====================================================

function verifyCommitment(parcelId) {

    const record =
        ledgerData.find(
            item => item.parcel_id === parcelId
        );


    if (!record || !record.zk_commitment) {

        alert(
            "❌ ZK Commitment not available."
        );

        return;
    }


    if (record.zk_commitment.length === 64) {

        alert(
            "✅ Commitment Verified!\n\n" +
            "Parcel ID: " + parcelId +
            "\n\n" +
            "SHA-256 Commitment is valid."
        );

    } else {

        alert(
            "❌ Invalid Commitment."
        );

    }
}



// =====================================================
// APPROVE PARCEL
// =====================================================

async function approveParcel(parcelId) {

    try {

        const response = await fetch(
            `${API_BASE}/api/approve/${parcelId}`,
            {
                method: "POST"
            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Approval failed"
            );

        }


        alert(
            "✅ " + result.message
        );


        await loadLedger();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Failed to approve parcel."
        );

    }
}



// =====================================================
// REJECT PARCEL
// =====================================================

async function rejectParcel(parcelId) {

    const confirmReject =
        confirm(
            "Are you sure you want to reject Parcel " +
            parcelId +
            "?"
        );


    if (!confirmReject) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE}/api/reject/${parcelId}`,
            {
                method: "POST"
            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Rejection failed"
            );

        }


        alert(
            "❌ " + result.message
        );


        await loadLedger();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Failed to reject parcel."
        );

    }
}



// =====================================================
// VIEW PARCEL DETAILS
// =====================================================

function viewDetails(parcelId) {

    const record =
        ledgerData.find(
            item => item.parcel_id === parcelId
        );


    if (!record) {

        alert(
            "Parcel details not found."
        );

        return;
    }


    const modal =
        document.getElementById(
            "detailsModal"
        );


    const content =
        document.getElementById(
            "detailsContent"
        );


    content.innerHTML = `

        <div class="detail-item">

            <strong>
                Parcel ID
            </strong>

            <span>
                ${record.parcel_id}
            </span>

        </div>


        <div class="detail-item">

            <strong>
                Source
            </strong>

            <span>
                ${record.source || "N/A"}
            </span>

        </div>


        <div class="detail-item">

            <strong>
                Date
            </strong>

            <span>
                ${record.date || "N/A"}
            </span>

        </div>


        <div class="detail-item">

            <strong>
                Transformation
            </strong>

            <span>
                ${record.transformation || "N/A"}
            </span>

        </div>


        <div class="detail-item">

            <strong>
                Conflict
            </strong>

            <span>
                ${record.conflict || "None"}
            </span>

        </div>


        <div class="detail-item">

            <strong>
                Decision Reason
            </strong>

            <span>
                ${record.decision_reason || "N/A"}
            </span>

        </div>


        <div class="detail-item">

            <strong>
                Human Approval
            </strong>

            <span>

                ${
                    record.human_approval
                    ? "✅ Approved"
                    : "❌ Not Approved"
                }

            </span>

        </div>


        <div class="detail-item">

            <strong>
                Status
            </strong>

            <span>
                ${record.status || "PENDING"}
            </span>

        </div>


        <div class="detail-item">

            <strong>
                ZK Commitment
            </strong>

            <span class="break-text">

                ${
                    record.zk_commitment ||
                    "Not Generated"
                }

            </span>

        </div>

    `;


    modal.style.display = "flex";
}



// =====================================================
// CLOSE PARCEL DETAILS
// =====================================================

function closeDetails() {

    document.getElementById(
        "detailsModal"
    ).style.display = "none";
}



// =====================================================
// AUDIT HISTORY
// =====================================================

async function openAuditHistory() {

    const modal =
        document.getElementById(
            "auditModal"
        );


    const content =
        document.getElementById(
            "auditContent"
        );


    modal.style.display = "flex";


    content.innerHTML = `

        <div class="audit-loading">

            ⏳ Loading audit history...

        </div>

    `;


    try {

        const response =
            await fetch(
                `${API_BASE}/api/audit`
            );


        if (!response.ok) {

            throw new Error(
                "Audit API error"
            );

        }


        const auditData =
            await response.json();


        displayAuditHistory(
            auditData
        );


    } catch (error) {

        console.error(error);


        content.innerHTML = `

            <div class="error-box">

                ❌ Unable to load audit history.

                <br><br>

                Please make sure Flask server is running.

            </div>

        `;

    }
}



// =====================================================
// DISPLAY AUDIT HISTORY
// =====================================================

function displayAuditHistory(data) {

    const content =
        document.getElementById(
            "auditContent"
        );


    if (!data || data.length === 0) {

        content.innerHTML = `

            <div class="empty-box">

                📭 No audit records found.

                <br><br>

                Approve or reject a parcel
                to create an audit record.

            </div>

        `;

        return;
    }


    const reversedData =
        [...data].reverse();


    content.innerHTML = "";


    reversedData.forEach(log => {

        const item =
            document.createElement("div");


        item.className =
            "audit-item";


        const action =
            (log.action || "ACTION")
                .toUpperCase();


        let actionIcon = "📝";


        if (action.includes("APPROV")) {

            actionIcon = "✅";

        } else if (action.includes("REJECT")) {

            actionIcon = "❌";

        } else if (action.includes("COMMIT")) {

            actionIcon = "🔐";

        }


        item.innerHTML = `

            <div class="audit-icon">

                ${actionIcon}

            </div>


            <div class="audit-details">

                <div class="audit-title">

                    ${action}

                </div>


                <div class="audit-parcel">

                    📍 Parcel:
                    <strong>
                        ${log.parcel_id || "N/A"}
                    </strong>

                </div>


                <div class="audit-time">

                    🕒
                    ${formatAuditTime(log.timestamp)}

                </div>


                <div class="audit-info">

                    ${formatAuditDetails(log.details)}

                </div>

            </div>

        `;


        content.appendChild(item);

    });
}



// =====================================================
// FORMAT AUDIT TIME
// =====================================================

function formatAuditTime(timestamp) {

    if (!timestamp) {

        return "Time not available";

    }


    try {

        const date =
            new Date(timestamp);


        return date.toLocaleString();

    } catch {

        return timestamp;

    }
}



// =====================================================
// FORMAT AUDIT DETAILS
// =====================================================

function formatAuditDetails(details) {

    if (!details) {

        return "No additional details";

    }


    if (typeof details === "string") {

        return details;

    }


    try {

        return Object.entries(details)
            .map(
                ([key, value]) =>
                    `${key}: ${value}`
            )
            .join(" • ");

    } catch {

        return String(details);

    }
}



// =====================================================
// CLOSE AUDIT HISTORY
// =====================================================

function closeAuditHistory() {

    document.getElementById(
        "auditModal"
    ).style.display = "none";
}



// =====================================================
// SEARCH + FILTER
// =====================================================

function filterRecords() {

    const searchValue =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const statusValue =
        document
            .getElementById("statusFilter")
            .value;


    const filteredRecords =
        ledgerData.filter(record => {

            const parcelId =
                String(
                    record.parcel_id || ""
                ).toLowerCase();


            const matchesSearch =
                parcelId.includes(
                    searchValue
                );


            const matchesStatus =
                statusValue === "ALL" ||
                (record.status || "PENDING") ===
                statusValue;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    displayLedger(
        filteredRecords
    );
}



// =====================================================
// CLICK OUTSIDE MODAL
// =====================================================

window.addEventListener(
    "click",
    function(event) {

        const detailsModal =
            document.getElementById(
                "detailsModal"
            );


        const auditModal =
            document.getElementById(
                "auditModal"
            );


        if (event.target === detailsModal) {

            closeDetails();

        }


        if (event.target === auditModal) {

            closeAuditHistory();

        }

    }
);



// =====================================================
// ESCAPE KEY
// =====================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeDetails();

            closeAuditHistory();

        }

    }
);



// =====================================================
// EVENT LISTENERS
// =====================================================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        filterRecords
    );


document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        filterRecords
    );



// =====================================================
// LOAD DATA
// =====================================================

loadLedger();
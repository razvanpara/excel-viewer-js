jQuery(() => {
    switch (window.location.pathname) {
        case "/": populateReportsTable();
            break;
        case "/viewReport": populateIndividualReport(window.location.search);
            break;
    }
});

async function populateReportsTable() {
    const tableDataReq = await fetch(`/reports`);
    if (tableDataReq.status !== 200) {
        alert("no data");
        return;
    }
    const tableData = await tableDataReq.json();
    const columns = Object.keys(tableData[0]).filter(k => k != 'link').map(col => {
        return {
            data: col,
            title: col
        }
    });
    $("#reports").DataTable({
        dom: "flrtip",
        data: tableData,
        columns: [
            ...columns,
            {
                "data": "link",
                "title": "Actions",
                "render": (data, type, row, meta) => type === 'display'
                    ? `<div class="btn-group-vertical">
                            <a href="viewReport?${data}" class="btn btn-sm btn-success">View report</a>                            
                            <a href="deleteReport?${data}" class="btn btn-sm btn-danger">Delete report</a>
                        </div>`
                    : data
            }
        ]
    });
}

async function populateIndividualReport(query = "?reportIndex=0") {
    const tableDataReq = await fetch(`/getReport${query}`);
    if (tableDataReq.status !== 200) {
        alert("no data");
        return;
    }
    const tableData = await tableDataReq.json();
    const columns = Object.keys(tableData[0]).map(col => {
        return {
            data: col,
            title: col
        }
    });
    $("#report").DataTable({
        dom: "Bflrtip",
        buttons: [
            'excel', 'pdf'
        ],
        data: tableData,
        columns,
        scroller: true,
        deferRender: true,
        scrollY: 600
    });
}
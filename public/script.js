const form = document.getElementById("threatForm");
const tableBody = document.getElementById("tableBody");
const totalThreats = document.getElementById("totalThreats");

async function loadThreats() {

    const response = await fetch("/api/threats");
    const threats = await response.json();

    tableBody.innerHTML = "";

    threats.forEach(threat => {

        let severityClass = "";

        if(threat.severity === "Low")
            severityClass = "low";

        if(threat.severity === "Medium")
            severityClass = "medium";

        if(threat.severity === "High")
            severityClass = "high";

        if(threat.severity === "Critical")
            severityClass = "critical-text";

        tableBody.innerHTML += `
        <tr>
            <td>${threat.id}</td>
            <td>${threat.name}</td>
            <td class="${severityClass}">
                ${threat.severity}
            </td>
            <td>${threat.region}</td>
        </tr>
        `;
    });

    totalThreats.innerText = 125 + threats.length;
}

form.addEventListener("submit", async(e)=>{

    e.preventDefault();

    await fetch("/api/threats",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            name:
            document.getElementById("name").value,

            severity:
            document.getElementById("severity").value,

            region:
            document.getElementById("region").value,

            description:
            document.getElementById("description").value

        })

    });

    form.reset();

    loadThreats();
});

loadThreats();
const baseUrl = "http://localhost:3000";

document.addEventListener('DOMContentLoaded', () => {
    fetchData('hospitals', 'hospital-list');
    fetchData('doctors', 'doctor-list');
    fetchData('patients', 'patient-list');
    fetchData('services', 'service-list');
    fetchData('appointments', 'appointment-list');
    populateSelects();
});

function fetchData(endpoint, listId) {
    fetch(`${baseUrl}/${endpoint}`)
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById(listId);
            list.innerHTML = data.map(item => {
                if (endpoint === 'appointments') {
                    return `
                        <li>
                            
                            <strong>Date:</strong> ${item.date} <br>
                            <strong>Time:</strong> ${item.time}
                        </li>`;
                } else {
                    return `
                        <li>
                          
                            ${item.image ? `<img src="${item.image}" alt="${item.name || ''}">` : ''}
                            
                            <strong>Name:</strong> ${item.name || item.specialization || item.description} <br>
                            <strong>Location:</strong> ${item.location || ''} <br>
                            
                          
                        </li>`;
                }
            }).join('');
        })
        .catch(error => console.error('Error fetching data:', error));
}

function populateSelects() {
    fetch(`${baseUrl}/patients`)
        .then(response => response.json())
        .then(data => {
            const patientSelect = document.getElementById('patient');
            patientSelect.innerHTML = data.map(patient => 
                `<option value="${patient.id}">${patient.name}</option>`
            ).join('');
        })
        .catch(error => console.error('Error fetching patients:', error));

    fetch(`${baseUrl}/doctors`)
        .then(response => response.json())
        .then(data => {
            const doctorSelect = document.getElementById('doctor');
            doctorSelect.innerHTML = data.map(doctor => 
                `<option value="${doctor.id}">${doctor.name} (${doctor.specialization})</option>`
            ).join('');
        })
        .catch(error => console.error('Error fetching doctors:', error));
}

document.getElementById('booking-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const patientId = document.getElementById('patient').value;
    const doctorId = document.getElementById('doctor').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    const appointment = {
        patientId,
        doctorId,
        date,
        time
    };

    fetch(`${baseUrl}/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointment)
    })
    .then(response => response.json())
    .then(data => {
        alert('Appointment booked successfully!');
        fetchData('appointments', 'appointment-list'); // Refresh the appointment list
    })
    .catch(error => console.error('Error booking appointment:', error));
});
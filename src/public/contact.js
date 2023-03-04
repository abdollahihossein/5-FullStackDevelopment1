let submitForm = document.getElementById("contact-form")
submitForm.addEventListener("submit", myFunction)

// Get the contact form data and prepare it to send to server with POST request:
function myFunction() {
    const myFormData = { fullname: document.getElementById("fullname").value,
                         email: document.getElementById("email").value,
                         phone: document.getElementById("phone").value,
                         company_name: document.getElementById("company_name").value,
                         project_name: document.getElementById("project_name").value,
                         project_desc: document.getElementById("project_description").value,
                         department: document.getElementById("department").value,
                         message: document.getElementById("message").value,
                         file: document.getElementById("attachment").value
    }
    fetch('http://localhost:3004/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(myFormData),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log('Success:', data)
            // Showing data recieved in an alert:
            document.getElementById("fullname_modal").innerHTML = data.fullname
            document.getElementById("email_modal").innerHTML = data.email
            document.getElementById("phone_modal").innerHTML = data.phone
            document.getElementById("company_name_modal").innerHTML = data.company_name
            document.getElementById("project_name_modal").innerHTML = data.project_name
            document.getElementById("project_desc_modal").innerHTML = data.project_desc
            document.getElementById("department_modal").innerHTML = data.department
            document.getElementById("message_modal").innerHTML = data.message
            document.getElementById("file_modal").innerHTML = data.file
        })
        .catch((err) => {
            console.error('Error:', err)
        })
}

(function () {
  const apiBaseUrl = "http://127.0.0.1:8000/api/v1/appointments";

  const SLOT = {
    10: "10:00 AM",
    10.5: "10:30 AM",
    11: "11:00 AM",
    11.5: "11:30 AM",
    12: "12:00 PM",
    12.5: "12:30 PM",
    2: "2:00 PM",
    2.5: "2:30 PM",
    3: "3:00 PM",
    3.5: "3:30 PM",
    4: "4:00 PM",
    4.5: "4:30 PM",
  };

  // Initialize the Appointment Booking Plugin
  function initAppointmentBooking() {
    function fetchAvailableSlots(date) {
      fetch(`${apiBaseUrl}?date=${date}`, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
          renderSlots(data);
        })
        .catch((error) => {
          console.error("Error fetching available slots:", error);
        });
    }

    function renderSlots(availableSlots) {
      const slotsContainer = document.getElementById("available-slots");
      slotsContainer.innerHTML = "";

      if (availableSlots.length === 0) {
        slotsContainer.innerHTML = "<p>No available slots for this date.</p>";
        return;
      }

      availableSlots.forEach((slot) => {
        const slotButton = document.createElement("button");
        slotButton.classList.add("slot-button");
        slotButton.innerText = SLOT[slot];
        slotButton.setAttribute("data-slot", slot); // Set a custom data attribute for easy selection
        slotButton.onclick = () => selectSlot(slotButton); // Pass button element to selectSlot
        slotsContainer.appendChild(slotButton);
      });
    }

    function selectSlot(slotButton) {
      // Remove the selected class from any previously selected slot
      const selectedSlot = document.querySelector(".slot-button.selected");
      if (selectedSlot) {
        selectedSlot.classList.remove("selected");
      }

      // Add the selected class to the clicked slot button
      slotButton.classList.add("selected");
    }

    function bookAppointment() {
      const name = document.getElementById("name").value;
      const phoneNumber = document.getElementById("phone-number").value;
      const appointmentDate = document.getElementById("appointment-date").value;
      const selectedSlotButton = document.querySelector(
        ".slot-button.selected"
      );

      if (!name || !phoneNumber || !appointmentDate || !selectedSlotButton) {
        alert("Please fill in all fields and select a time slot.");
        return;
      }

      const slot = selectedSlotButton.getAttribute("data-slot"); // Get the slot value from the button's data attribute
      const appointmentData = {
        name,
        phone_number: phoneNumber,
        date: appointmentDate,
        slot: parseFloat(slot), // Convert the slot value to float
      };

      fetch(apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to book appointment");
          }
          alert("Appointment booked successfully!");
        })
        .catch((error) => {
          alert("Failed to book the appointment. Please try again later.");
          console.error("Booking error:", error);
        });
    }

    document
      .getElementById("appointment-date")
      .addEventListener("change", function () {
        const selectedDate = this.value;
        fetchAvailableSlots(selectedDate);
      });

    // Expose the `bookAppointment` function for use on the page
    window.bookAppointment = bookAppointment;
  }

  // Expose the init function to initialize the plugin with API base URL
  window.initAppointmentBooking = initAppointmentBooking;
})();

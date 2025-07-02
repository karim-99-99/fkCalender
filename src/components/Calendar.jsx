import React, { useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import emailjs from "emailjs-com";

const locales = {
  "en-US": enUS,
};

// Set week to start on Saturday (weekStartsOn: 6)
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 6 }),
  getDay,
  locales,
});

function formatHourRange(hour) {
  const start = new Date();
  start.setHours(hour, 0, 0, 0);
  const end = new Date();
  end.setHours(hour + 1, 0, 0, 0);
  const options = { hour: "numeric", minute: "2-digit", hour12: true };
  return `${start.toLocaleTimeString([], options)} - ${end.toLocaleTimeString(
    [],
    options
  )}`;
}

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [showHourModal, setShowHourModal] = useState(false);
  const [reservationName, setReservationName] = useState("");
  const [reservationReason, setReservationReason] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
  };

  const closeModal = () => setSelectedDate(null);

  const handleHourClick = (hour) => {
    setSelectedHour(hour);
    setShowHourModal(true);
  };

  const closeHourModal = () => {
    setShowHourModal(false);
    setReservationName("");
    setReservationReason("");
  };
  const sendEmail = (e) => {
    e.preventDefault();
    closeHourModal();

    emailjs
      .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", e.target, "YOUR_USER_ID")
      .then(
        (result) => {
          console.log("Email sent!", result.text);
        },
        (error) => {
          console.error("Failed to send email:", error.text);
        }
      );
  };
  // const handleReservationSubmit = (e) => {
  //   e.preventDefault();
  //   // You can handle the reservation data here (e.g., save to state or send to backend)
  //   closeHourModal();
  // };

  // Custom navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };
  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  // Custom toolbar (hidden)
  const CustomToolbar = () => {
    return (
      <div className="hidden">
        {/* Custom toolbar content can go here if needed */}
      </div>
    );
  };

  return (
    <div className=" md:p-28 md:-mt-20 ">
      <div className="bg-white rounded-xl shadow-2xl mt-4 p-6 ">
        {/* Remove all borders inside the calendar */}
        <style>
          {`
        .rbc-month-row,
        .rbc-month-header,
        .rbc-header,
        .rbc-row-content,
        .rbc-date-cell,
        .rbc-day-bg,
        .rbc-month-view {
          border: none !important;
        }
        .rbc-day-bg,
        .rbc-header {
          background: white !important;
        }
        
        .rbc-button-link,
        .rbc-button ,
        .rbc-header,
        .rbc-content {
          background: white !important;
          margin-top: 25px !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }
           @media (min-width: 320px) {
            .rbc-button-link,
            .rbc-button {
              padding-left: 6px !important;
            }
                @media (min-width: 375px) {
            .rbc-button-link,
            .rbc-button {
              padding-left: 13px !important;
            }
          @media (min-width: 768px) {
.rbc-button-link,
.rbc-button,
.rbc-data-cell {
            padding-left: 20px !important;

          }
            @media (min-width: 1024px) {
            .rbc-button-link,
            .rbc-button,
            .rbc-data-cell {
              padding-left: 40px !important;
            }
            @media (min-width: 1440px) {
            .rbc-button-link,
            .rbc-button,
            .rbc-data-cell {
              padding-left: 60px !important;
            }
           
            
      `}
        </style>
        {/* Custom Month Navigation */}
        <div className="flex items-center justify-center mb-2 gap-4">
          <button
            className="p-2 rounded-full hover:bg-gray-200"
            onClick={handlePrevMonth}
          >
            <FaChevronLeft />
          </button>
          <span className="font-semibold text-lg">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            className="p-2 rounded-full hover:bg-gray-200"
            onClick={handleNextMonth}
          >
            <FaChevronRight />
          </button>
        </div>
        <BigCalendar
          localizer={localizer}
          selectable
          onSelectSlot={handleSelectSlot}
          style={{ height: 500 }}
          views={["month"]}
          date={currentDate}
          onNavigate={setCurrentDate}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </div>
      <div className="lg:mb-48">
        {/* Modal below calendar */}
        {selectedDate && (
          <div className="mt-6 flex justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-center">
                {selectedDate.toDateString()}
              </h2>
              <div className="flex flex-col">
                {[...Array(24)].map((_, hour) => (
                  <React.Fragment key={hour}>
                    <div
                      className="p-2 text-center bg-gray-100 cursor-pointer hover:bg-orange-100"
                      onClick={() => handleHourClick(hour)}
                    >
                      {formatHourRange(hour)}
                    </div>
                    {hour !== 23 && (
                      <div className="border-t-2 border-orange-500 w-full" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Hour Reservation Modal */}
        {showHourModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
              <h2 className="text-lg font-bold mb-4 text-center">
                Reservation for {selectedDate?.toDateString()} <br />
                <span className="text-base font-medium text-gray-600">
                  {formatHourRange(selectedHour)}
                </span>
              </h2>
              <form onSubmit={sendEmail} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="border rounded p-2"
                  value={reservationName}
                  onChange={(e) => setReservationName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Reason for reservation"
                  className="border rounded p-2"
                  value={reservationReason}
                  onChange={(e) => setReservationReason(e.target.value)}
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Reserve
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 bg-gray-400 text-white rounded"
                    onClick={closeHourModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Calendar;

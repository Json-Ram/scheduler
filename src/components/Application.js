import React, { useEffect, useState } from "react";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import axios from "axios";
import { getAppointmentsForDay, getInterview } from "Helpers/selectors";


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const setDay = day => setState({...state, day});

  const appointmentItem = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    console.log(interview)
    return (
    <Appointment
      key={appointment.id}
      id={appointment.id}
      time={appointment.time}
      interview={interview}
    />
    )
  });

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      console.log(all[2].data)
      setState(prev => ({...prev,
        appointments: all[0].data,
        days: all[1].data,
        interviewers: all[2].data
      }))
    })
  }, []);
  
  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler" />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
          days={state.days}
          value={state.day}
          onChange={setDay}
          />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs" />
      </section>
      <section className="schedule">
        <ul>
          {appointmentItem}
          <Appointment key="last" time="5pm" />
        </ul>
      </section>
    </main>
  );
}


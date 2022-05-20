import React, { useEffect, useState } from "react";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import axios from "axios";
import { getAppointmentsForDay } from "Helpers/selectors";


//const appointments = {
//  "1": {
//    id: 1,
//    time: "12pm",
//  },
//  "2": {
//    id: 2,
//    time: "1pm",
//    interview: {
//      student: "Lydia Miller-Jones",
//      interviewer:{
//        id: 3,
//        name: "Sylvia Palmer",
//        avatar: "https://i.imgur.com/LpaY82x.png",
//      }
//    }
//  },
//  "3": {
//    id: 3,
//    time: "2pm",
//  },
//  "4": {
//    id: 4,
//    time: "3pm",
//    interview: {
//      student: "Archie Andrews",
//      interviewer:{
//        id: 4,
//        name: "Cohana Roy",
//        avatar: "https://i.imgur.com/FK8V841.jpg",
//      }
//    }
//  },
//  "5": {
//    id: 5,
//    time: "4pm",
//  }
//};


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const setDay = day => setState({...state, day});

  const appointmentItem = dailyAppointments.map((appointment) => 
    <Appointment
      key={appointment.id}
      {...appointment}
    />
  )

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/days')
    ]).then((all) => {
      console.log(all)
      setState(prev => ({...prev, appointments: all[0].data, days: all[1].data}))
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


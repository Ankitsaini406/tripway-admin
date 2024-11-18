'use client';

import { useState } from "react";
import Dashboard from "@/pages/Dashborad";
import style from './page.module.css';
import AgentView from "@/pages/agentView";
import UserView from "@/pages/userView";
import TourView from "@/pages/tourView";
import CabsView from "@/pages/cabsView";

export default function Home() {
  const [activeButton, setActiveButton] = useState('Dashboard');
  return (
  <>
    <div className={style.adminpage}>
      <Slidebar activeButton={activeButton} onButtonClick={setActiveButton} />
      <BodyContent activeButton={activeButton}/>
    </div>
  </>
  );
}

export function Slidebar({ activeButton, onButtonClick }) {

  return (
    <nav className={`${style.sidebar}`}>
      <ul className={`${style.silderlist}`}>
        {["Dashboard", "Agents", "Users", "Tour", "Cabs", "Slider"].map((button) => (
          <li
            key={button}
            onClick={() => onButtonClick(button)}
            className={`${style.sliderli} ${activeButton === button ? `${style.active}` : ''}`}
          >
            <span>{button}</span>
          </li>
        ))}
        <li
          onClick={() => onButtonClick('Logout')}
          className={`${style.sliderli} ${activeButton === 'Logout' ? `${style.active}` : ''}`}
        >
          <span>Logout</span>
        </li>
      </ul>
    </nav>
  )
}

export function BodyContent({ activeButton }) {
  return (
    <div className={style.dashboardpage}>
      <h1>{activeButton}</h1>
      {activeButton === "Dashboard" && <Dashboard />}
      {activeButton === "Agents" && <AgentView />}
      {activeButton === "Users" && <UserView />}
      {activeButton === "Tour" && <TourView />}
      {activeButton === "Cabs" && <CabsView />}
      {activeButton === "Slider" && <p>Edit your sliders here.</p>}
      {activeButton === "Logout" && ""}
    </div>
  )
}
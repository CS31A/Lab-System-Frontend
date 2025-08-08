import { createApp } from "vue";
import App from "./App.vue";
import SideBar from "./Components/SideBar.vue";
import "./Assets/main.css"; 
import "primeicons/primeicons.css"; 

const app = createApp(App);

app.component("SideBar", SideBar);

app.mount("#app");
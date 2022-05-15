currentDate = new Date();
document.getElementById("currentDate").innerHTML =
  currentDate.toLocaleDateString("en-UK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
currentYear = currentDate.getFullYear();
document.querySelector("#year").innerHTML = currentYear;
lastUpdated = document.lastModified;
document.getElementById("last-updated").innerHTML = lastUpdated;

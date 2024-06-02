let timer;
let hours = 0;
let minutes = 0;
let seconds = 0;
let lapCounter = 1;
const laps = [];
const history = JSON.parse(localStorage.getItem("stopwatchHistory")) || [];

function displayTime() {
    const h = hours < 10 ? `0${hours}` : hours;
    const m = minutes < 10 ? `0${minutes}` : minutes;
    const s = seconds < 10 ? `0${seconds}` : seconds;
    document.getElementById("display").textContent = `${h}:${m}:${s}`;
}

function start() {
    timer = setInterval(updateTime, 1000);
    document.getElementById("start").disabled = true;
    document.getElementById("stop").disabled = false;
    document.getElementById("lap").disabled = false;
}

function stop() {
    clearInterval(timer);
    document.getElementById("start").disabled = false;
    document.getElementById("stop").disabled = true;
    document.getElementById("lap").disabled = true;
}

function reset() {
    clearInterval(timer);
    hours = minutes = seconds = 0;
    displayTime();
    document.getElementById("start").disabled = false;
    document.getElementById("stop").disabled = true;
    document.getElementById("lap").disabled = true;
    lapCounter = 1;
    document.getElementById("laps").innerHTML = "";
    laps.length = 0;
}

function updateTime() {
    seconds++;
    if (seconds === 60) {
        seconds = 0;
        minutes++;
        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
    }
    displayTime();
}

function lap() {
    const lapTime = document.getElementById("display").textContent;
    laps.push(`Lap ${lapCounter}: ${lapTime}`);
    updateLapTimes();
    lapCounter++;
}

function updateLapTimes() {
    const lapsList = document.getElementById("laps");
    lapsList.innerHTML = laps.map(lap => `<li>${lap}</li>`).join("");
}

function shareTimes() {
    const timesToShare = [...laps, `Total Time: ${document.getElementById("display").textContent}`].join("\n");
    if (navigator.share) {
        navigator.share({
            title: 'Stopwatch Times',
            text: timesToShare,
        }).then(() => {
            console.log('Successfully shared');
        }).catch((error) => {
            console.error('Error sharing:', error);
        });
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = timesToShare;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert('Times copied to clipboard');
    }
}

document.getElementById("start").addEventListener("click", start);
document.getElementById("stop").addEventListener("click", stop);
document.getElementById("reset").addEventListener("click", reset);
document.getElementById("lap").addEventListener("click", lap);
document.getElementById("share").addEventListener("click", shareTimes);

window.addEventListener("beforeunload", () => {
    const totalTime = document.getElementById("display").textContent;
    if (totalTime !== "00:00:00" && !laps.length) {
        history.push(`Total Time: ${totalTime}`);
        localStorage.setItem("stopwatchHistory", JSON.stringify(history));
    }
});

window.addEventListener("load", () => {
    const historyList = document.getElementById("history");
    if (history.length) {
        history.forEach(entry => {
            const listItem = document.createElement("li");
            listItem.textContent = entry;
            historyList.appendChild(listItem);
        });
    }
});
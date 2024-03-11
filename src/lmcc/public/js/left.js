// beginCall("lmcc_left", "lmcc_right")
// initPeer("lmcc_left")

function createTask() {
    var taskName = document.getElementById('taskSelector').value;

    fetch('/createTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName: taskName })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to create task');
    })
    .catch(error => console.error('Error creating task:', error));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function fetchAllTasks() {
	var taskCatSel = document.getElementById('taskCategorySelector');
	var taskSel = document.getElementById('taskSelector');

	taskSel.replaceChildren([]);

    fetch('/alltasks')
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json()
    })
	.then(data => {
		console.log(data)
		for (var task of data) {
			if (task == '\n') {
				continue
			}

			var el = document.createElement("option");
			el.value = task.split(".")[0];
			var this_task_cat = task.split("_")[0]
			el.textContent = capitalizeFirstLetter(this_task_cat) + " " + task.split("_")[1].split(".")[0]
			if ("cat_" + this_task_cat == taskCatSel.value) {
				taskSel.appendChild(el)
			}
		}
	})
    .catch(error => console.error('Error creating task:', error));
}

fetchAllTasks()
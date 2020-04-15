const db = firebase.firestore();
const submissionsRef = db.collection('submissions');
const submissionsEl = document.getElementById('submissions');
const baseName = 'SpArkl3P0ny';
const textEl = document.getElementById('name');
const setGeneratedNameEl = (name) => {
    textEl.innerHTML = `Congrats! Your new playa name is: <h1><b>${name}</b></h1>`
};
let generatedName = window.localStorage.getItem('generatedName');
if(generatedName) setGeneratedNameEl(generatedName);
submissionsRef.onSnapshot((snapshot) => {
    // Only show all submissions if they have generated a name
    if(!generatedName) return;
    // Remove all children
    submissionsEl.innerHTML = '';
    snapshot.docs.forEach(submission => {
        let submissionEl = document.createElement('span');
        submissionEl.classList.add('submission');
        submissionEl.innerText = `${baseName}${submission.data().id} - ${submission.data().text}`;
        submissionEl.setAttribute('role', 'textbox');
        submissionsEl.appendChild(submissionEl);
    })
});

const generateName = async () => {
    if(generatedName) return;
    const inputEl = document.getElementById('desc');
    const inputErrEl = document.getElementById('input-error');
    // Handle error messages if no desc input
    if (!inputEl.value) {
        inputErrEl.style.display = 'block';
        inputEl.classList.add('error-border');
        return
    }
    // Remove error msgs if present
    inputErrEl.style.display = 'none';
    inputEl.classList.remove('error-border');

    textEl.innerHTML = '<h1 class="generating">Generating<span>.</span><span>.</span><span>.</span></h1>';
    try {
        const docRef = await submissionsRef.add({text: inputEl.value});
        docRef.onSnapshot((doc) => {
            generatedName = `${baseName}${doc.data().id}`;
            window.localStorage.setItem('generatedName', generatedName);
            if (doc.data() && doc.data().id) setGeneratedNameEl(generatedName);
        });
    } catch(error) {
        // TODO: show error to user if this fails
        console.error("Error adding document: ", error);
    }
};

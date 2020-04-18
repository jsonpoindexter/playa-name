const db = firebase.firestore();
const submissionsRef = db.collection('submissions');
const submissionsEl = document.getElementById('submissions');
const baseName = 'SpArkl3P0ny';
const textEl = document.getElementById('name');

const listenForSubmissions = () => {
    submissionsRef.onSnapshot((snapshot) => {
        // Only show all submissions if they have generated a name
        if (!generatedName) return;
        // Remove all children
        submissionsEl.innerHTML = '';
        snapshot.docs.forEach(submission => {
            if(!submission.data().id) return
            let submissionEl = document.createElement('span');
            submissionEl.classList.add('submission');
            submissionEl.innerText = `${baseName}${submission.data().id} - ${submission.data().text}`;
            // removes google's Touch to Search
            // https://stackoverflow.com/questions/30648401/disable-mobile-chrome-43s-touch-to-search-feature-programmatically
            submissionEl.setAttribute('role', 'textbox');
            submissionsEl.appendChild(submissionEl);
        })
    });
}

const setGeneratedNameEl = (name) => {
    textEl.innerHTML = `Congrats! Your new playa name is: <h1><b>${name}</b></h1>`
    listenForSubmissions();
};
let generatedName = window.localStorage.getItem('generatedName');
if (generatedName) setGeneratedNameEl(generatedName);

const generateName = async () => {
    if (generatedName) return;
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
            if (doc.data() && doc.data().id) {
                generatedName = `${baseName}${doc.data().id}`;
                window.localStorage.setItem('generatedName', generatedName);
                setGeneratedNameEl(generatedName);
            }
        });
    } catch (error) {
        // TODO: show error to user if this fails
        console.error("Error adding document: ", error);
    }
};

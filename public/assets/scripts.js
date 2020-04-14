const db = firebase.firestore();
const submissionsRef = db.collection('submissions');
const generateName = async () => {
    const textEl = document.getElementById('name');
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

    textEl.innerHTML = '<h1 class="loading">Loading<span>.</span><span>.</span><span>.</span></h1>';
    try {
        const docRef = await submissionsRef.add({text: inputEl.value});
        docRef.onSnapshot((doc) => {
            if (doc.data() && doc.data().id) textEl.innerHTML = `Congrats! Your new playa name is: <h1><b>SpArkl3P0ny${doc.data().id}</b></h1>`;
        });
    } catch(error) {
        // TODO: show error to user if this fails
        console.error("Error adding document: ", error);
    }
};

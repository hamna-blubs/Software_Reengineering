// ==========================================
// ELEMENTS
// ==========================================

const noteForm = document.querySelector("#noteForm");

const noteTitle = document.querySelector("#noteTitle");
const noteContent = document.querySelector("#noteContent");

const titleError = document.querySelector("#titleError");
const contentError = document.querySelector("#contentError");

const saveButton = document.querySelector("#saveButton");
const cancelButton = document.querySelector("#cancelButton");

const searchInput = document.querySelector("#searchInput");

const notesContainer =
    document.querySelector("#notesContainer");

const notesCount =
    document.querySelector("#notesCount");

const formHeading =
    document.querySelector("#formHeading");


// ==========================================
// DATA
// ==========================================

let notes =
    JSON.parse(localStorage.getItem("notes")) || [];

let editingNoteId = null;


// ==========================================
// SAVE TO LOCAL STORAGE
// ==========================================

function saveNotes() {

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );
}


// ==========================================
// VALIDATION
// ==========================================

function validateForm() {

    let isValid = true;

    const title =
        noteTitle.value.trim();

    const content =
        noteContent.value.trim();


    // Clear previous errors

    titleError.textContent = "";
    contentError.textContent = "";


    // Validate title

    if (title === "") {

        titleError.textContent =
            "Please enter a note title.";

        isValid = false;
    }


    // Validate content

    if (content === "") {

        contentError.textContent =
            "Please enter some note content.";

        isValid = false;
    }


    return isValid;
}


// ==========================================
// CREATE / UPDATE NOTE
// ==========================================

noteForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        if (!validateForm()) {
            return;
        }


        const title =
            noteTitle.value.trim();

        const content =
            noteContent.value.trim();


        // EDIT EXISTING NOTE

        if (editingNoteId !== null) {

            const note =
                notes.find(
                    item => item.id === editingNoteId
                );


            note.title = title;

            note.content = content;

            note.updatedAt =
                new Date().toISOString();

        }


        // CREATE NEW NOTE

        else {

            const newNote = {

                id: Date.now(),

                title: title,

                content: content,

                updatedAt:
                    new Date().toISOString()

            };


            notes.unshift(newNote);

        }


        saveNotes();

        renderNotes();

        resetForm();

    }
);


// ==========================================
// RENDER NOTES
// ==========================================

function renderNotes() {

    notesContainer.replaceChildren();


    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const filteredNotes =
        notes.filter(note => {

            return (
                note.title
                    .toLowerCase()
                    .includes(searchTerm)
                ||
                note.content
                    .toLowerCase()
                    .includes(searchTerm)
            );

        });


    notesCount.textContent =
        `${filteredNotes.length} ${
            filteredNotes.length === 1
                ? "note"
                : "notes"
        }`;


    // No notes

    if (filteredNotes.length === 0) {

        const emptyMessage =
            document.createElement("div");

        emptyMessage.classList.add(
            "empty-message"
        );

        emptyMessage.textContent =
            searchTerm
                ? "No notes match your search."
                : "You don't have any notes yet.";

        notesContainer.appendChild(
            emptyMessage
        );

        return;
    }


    // Create cards

    filteredNotes.forEach(note => {

        const card =
            document.createElement("article");

        card.classList.add("note-card");


        // Title

        const title =
            document.createElement("h3");

        title.textContent =
            note.title;


        // Content

        const content =
            document.createElement("p");

        content.classList.add(
            "note-content"
        );

        content.textContent =
            note.content;


        // Date

        const date =
            document.createElement("p");

        date.classList.add("note-date");

        date.textContent =
            `Last edited: ${
                formatDate(note.updatedAt)
            }`;


        // Actions

        const actions =
            document.createElement("div");

        actions.classList.add(
            "note-actions"
        );


        // Edit button

        const editButton =
            document.createElement("button");

        editButton.textContent =
            "Edit";

        editButton.classList.add(
            "edit-btn"
        );

        editButton.addEventListener(
            "click",
            () => editNote(note.id)
        );


        // Delete button

        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete";

        deleteButton.classList.add(
            "delete-btn"
        );

        deleteButton.addEventListener(
            "click",
            () => deleteNote(note.id)
        );


        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        card.appendChild(title);

        card.appendChild(content);

        card.appendChild(date);

        card.appendChild(actions);


        notesContainer.appendChild(card);

    });

}


// ==========================================
// EDIT NOTE
// ==========================================

function editNote(id) {

    const note =
        notes.find(
            item => item.id === id
        );


    if (!note) {
        return;
    }


    editingNoteId = id;


    noteTitle.value =
        note.title;

    noteContent.value =
        note.content;


    formHeading.textContent =
        "Edit Note";

    saveButton.textContent =
        "Update Note";

    cancelButton.classList.remove(
        "hidden"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// DELETE NOTE
// ==========================================

function deleteNote(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this note?"
        );


    if (!confirmed) {
        return;
    }


    notes =
        notes.filter(
            note => note.id !== id
        );


    saveNotes();

    renderNotes();


    // If deleting while editing

    if (editingNoteId === id) {
        resetForm();
    }

}


// ==========================================
// CANCEL EDIT
// ==========================================

cancelButton.addEventListener(
    "click",
    resetForm
);


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

    noteForm.reset();


    titleError.textContent = "";

    contentError.textContent = "";


    editingNoteId = null;


    formHeading.textContent =
        "Create a New Note";

    saveButton.textContent =
        "Add Note";

    cancelButton.classList.add(
        "hidden"
    );

}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    renderNotes
);


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleString(
        "en-US",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


// ==========================================
// INITIAL LOAD
// ==========================================

renderNotes();
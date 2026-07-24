/* ==========================================================
   AI SLOP TRAINING
   Version 2.0
========================================================== */

let currentTab = 0;

/* ==========================================================
   INITIALIZE
========================================================== */

document.addEventListener("DOMContentLoaded",()=>{

    initializeTabs();

    initializeProgress();

    initializeStartButton();

    initializePromptBuilder();

    initializeExplorer();

    initializeDeveloperPicker();
    
    initializeAssessment();


});

/* ==========================================================
   TAB NAVIGATION
========================================================== */

function initializeTabs() {

    const buttons = document.querySelectorAll(".tab-button");
    const tabs = document.querySelectorAll(".tab");

    function showTab(index) {

        // Safety check
        if (index < 0 || index >= tabs.length) return;

        // Remove active classes
        buttons.forEach(button =>
            button.classList.remove("active")
        );

        tabs.forEach(tab =>
            tab.classList.remove("active")
        );

        // Activate selected tab
        buttons[index].classList.add("active");
        tabs[index].classList.add("active");

        currentTab = index;

        updateProgress(index);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    // -------------------------
    // Top Navigation
    // -------------------------

    buttons.forEach((button, index) => {

        button.addEventListener("click", () => {

            showTab(index);

        });

    });

    // -------------------------
    // Next Buttons
    // -------------------------

    document.querySelectorAll(".next-tab").forEach(button => {

        button.addEventListener("click", () => {

            showTab(currentTab + 1);

        });

    });

    // -------------------------
    // Previous Buttons
    // -------------------------

    document.querySelectorAll(".previous-tab").forEach(button => {

        button.addEventListener("click", () => {

            showTab(currentTab - 1);

        });

    });

    // Initial tab

    showTab(0);

}

/* ==========================================================
   START BUTTONS
========================================================== */

function initializeStartButton() {

    /* ----------------------------------------
       Tab 1 - Start Learning
    ---------------------------------------- */

    const learningButton =
        document.getElementById("startLearning");

    if (learningButton) {

        learningButton.addEventListener("click", () => {

            const lesson =
                document.getElementById("lesson1");

            if (!lesson) return;

            lesson.scrollIntoView({

                behavior: "smooth"

            });

        });

    }

    /* ----------------------------------------
       Tab 4 - Start Assessment
    ---------------------------------------- */

    const assessmentButton =
        document.getElementById("startAssessment");

    if (assessmentButton) {

        assessmentButton.addEventListener("click", startQuiz);

    }

}

/* ==========================================================
   PROMPT BUILDER
========================================================== */

function initializePromptBuilder() {

    const button = document.getElementById("generatePrompt");

    if (!button) return;

    button.addEventListener("click", () => {

        const people = document.getElementById("peopleSelect").value;
        const action = document.getElementById("actionSelect").value;
        const count = document.getElementById("countSelect").value;
        const text = document.getElementById("textSelect").value;
        const interaction = document.getElementById("interactionSelect").value;
        const scene = document.getElementById("sceneSelect").value;

        const prompt = `A ${scene} where ${count.toLowerCase()} sit with ${people.toLowerCase()}. A receptionist is ${action.toLowerCase()} while ${text.toLowerCase()} are clearly visible throughout the room. Several people are ${interaction.toLowerCase()}.`;

        document.getElementById("generatedPrompt").textContent = prompt;

    });

}

/* ==========================================================
   PROGRESS
========================================================== */

function initializeProgress() {

    updateProgress(0);

}

function updateProgress(tab) {

    const fill =
        document.getElementById("progressFill");

    const percent =
        document.getElementById("progressPercent");

    const buttons =
        document.querySelectorAll(".tab-button");

    const labels = [

        "Introduction",
        "Prompt Writing",
        "AI Tell Explorer",
        "Quiz"

    ];

    const progress =
        ((tab + 1) / buttons.length) * 100;

    if (fill)
        fill.style.width = progress + "%";

    if (percent)
        percent.textContent = Math.round(progress) + "%";

    // Reset labels

    buttons.forEach((button, index) => {

        button.classList.remove("completed");

        button.innerHTML =
            `${index + 1}&#x20e3; ${labels[index]}`;

    });

    // Mark completed

    for (let i = 0; i < tab; i++) {

        buttons[i].classList.add("completed");

        buttons[i].innerHTML =
            `✓ ${labels[i]}`;

    }

}
/* ==========================================================
   TAB 3 - ANNOTATION EXPLORER ENGINE
========================================================== */

/* ----------------------------------------------------------
   Explorer State
---------------------------------------------------------- */

const explorer={

    image:"veterinaryClinic",

    annotations:[],

    selected:null,

    categoryFilter:"all",

    developerMode:false,

    dragTarget:null,

    dragging:false

};

document.addEventListener("keydown",(event)=>{

    if(
        event.ctrlKey &&
        event.shiftKey &&
        event.key.toLowerCase()==="d"
    ){

        event.preventDefault();

        console.log("Developer shortcut detected!");

        toggleDeveloperMode();

    }

});
function toggleDeveloperMode(){

    explorer.developerMode = !explorer.developerMode;

    const panel = document.getElementById("developerPanel");

    panel.classList.toggle(
        "hidden",
        !explorer.developerMode
    );

    if(explorer.developerMode){

        panel.scrollIntoView({
            behavior:"smooth",
            block:"start"
        });

    }

}
function updateDeveloperPanel(){

    if(!explorer.selected) return;

    document.getElementById("devSelected").textContent =
        explorer.selected.id;

    const x =
        document.getElementById("devX");

    const y =
        document.getElementById("devY");

    x.value = explorer.selected.x;

    y.value = explorer.selected.y;

    document.getElementById("devCoordinates").textContent =
        `(${explorer.selected.x}%, ${explorer.selected.y}%)`;

    x.oninput = ()=>{

        explorer.selected.x =
            Number(x.value);

        renderHotspots();

        document.getElementById("devCoordinates").textContent =
            `(${explorer.selected.x}%, ${explorer.selected.y}%)`;

    };

    y.oninput = ()=>{

        explorer.selected.y =
            Number(y.value);

        renderHotspots();

        document.getElementById("devCoordinates").textContent =
            `(${explorer.selected.x}%, ${explorer.selected.y}%)`;

    };

}
/* ----------------------------------------------------------
   Annotation Database
---------------------------------------------------------- */

const annotationDatabase = {

    veterinaryClinic: {

        image: "images/veterinary-clinic.jpg",

        prompt:
`A veterinary clinic waiting room where exactly three cats sit with five owners. A receptionist reviews appointment forms while printed schedules, pet name tags, vaccination records, and informational posters are visible throughout the room.`,

annotations: [

{
    id: "T1",
    category: "text",
    x: 31.5,
    y: 7.6,
    title: "Unreadable Poster Headings",
    issue: "The informational poster contains distorted letters that resemble words but cannot be read; even from a distance, they are large enough to be visible and should logically be clear.",
    explanation: "AI image generators often imitate the appearance of text instead of producing meaningful language.",
    inspectionTip: "Always zoom in on posters, signs, labels, and printed materials.",
    keyTakeaway: "Unreadable text remains one of the strongest indicators of AI-generated imagery."
},

{
    id: "T2",
    category: "text",
    x: 86.7,
    y: 83.7,
    title: "Appointment Form",
    issue: "The label on top of the binder contains garbled, upside-down, and distorted letters that look like text but are completely unreadable, even though it is right in the foreground.",
    explanation: "AI image generators frequently fail to maintain coherent spelling or consistent orientation on surface text and labels.",
    inspectionTip: "Check text on foreground objects, desks, and binders to ensure characters maintain proper spelling and alignment.",
    keyTakeaway: "Foreground text that is close and in focus but inexplicably mangled serves as an obvious AI generation tell."
},

{
    id: "T3",
    category: "text",
    x: 73.3,
    y: 40.5,
    title: "Incorrect Spelling ",
    issue: "The label on the jar ODDATIONS instead of Donations.",
    explanation: "AI generators frequently struggle to render coherent language on container labels, digital screens, and fine print.",
    inspectionTip: "Examine the text closely on foreground objects, signs, and screens to see if the characters spell real words.",
    keyTakeaway: "Mangled text on prominent foreground items like jars serves as a classic indicator of AI generation."
},

{
    id: "A1",
    category: "anatomy",
    x: 17.3,
    y: 28.7,
    title: "The Deformed Animals on Posters",
    issue: "The animals depicted on the wall posters feature warped, unrecognizable anatomy, fused body parts, and mangled faces that do not resemble real dogs or pets.",
    explanation: "AI generators often render small background details, such as text on posters and animal imagery within them, as abstract smudges or distorted shapes since they lack deep structural focus.",
    inspectionTip: "Examine background elements like wall art, flyers, and posters to see if the graphics degenerate into nonsense shapes and gibberish text.",
    keyTakeaway: "Deformed animal figures on background posters serve as an explicit tell of AI-generated image artifacts."
},

{
    id: "A2",
    category: "anatomy",
    x: 35,
    y: 47.2,
    title: "The Pet’s Facial Distortion",
    issue: "The cat's face features warped, distorted eyes and an unnatural expression that fails to resemble a real animal.",
    explanation: "AI image generators frequently struggle to render complex facial features and fine anatomical details on animals.",
    inspectionTip: "Zoom in closely on animal faces and features to check for symmetry, realistic eye formation, and proper structure.",
    keyTakeaway: "Mangled or distorted animal facial features serve as a strong indicator of AI-generated imagery."
},

{
    id: "A3",
    category: "anatomy",
    x: 87.9,
    y: 42,
    title: "The Weird Teeth",
    issue: "The woman's visible teeth display an unnatural, blocky shape and irregular alignment rather than individual, distinct tooth structures.",
    explanation: "AI image generators frequently struggle to render fine human facial details like teeth and smiles accurately, often smudging them into solid or distorted shapes.",
    inspectionTip: "Zoom in closely on smiling faces to check if teeth maintain natural shapes, separation, and realistic alignment.",
    keyTakeaway: "Distorted or blocky teeth on human subjects serve as a reliable indicator of AI-generated imagery."
},

{
    id: "O1",
    category: "object",
    x: 90.8,
    y: 78.2,
    title: "Boundary Blur",
    issue: "The transition space between the edge of the paper stack and the foreground binder exhibits an unnatural blur and artificial blending artifact.",
    explanation: "AI image generators frequently struggle with depth separation and clean edge transitions when multiple overlapping flat objects are placed closely together.",
    inspectionTip: "Look closely at the boundaries where overlapping documents, folders, and desk items meet to check for harsh cutouts or muddy blurring.",
    keyTakeaway: "Unnatural blending artifacts between closely stacked objects indicate a failure in spatial depth rendering typical of AI-generated images."
},

{
    id: "O2",
    category: "object",
    x: 76.7,
    y: 56.5,
    title: "The Warping Phone ",
    issue: "The office telephone exhibits structural warping, with its keypad buttons, display screen, and handset cradling edges melting together into distorted, non-functional shapes.",
    explanation: "AI image generators frequently fail to replicate the precise geometric symmetry and structured button grids found on complex office electronics like desk phones.",
    inspectionTip: "Examine the keypad layout, button alignment, and connection points of the telephone to check if they form logical, functional hardware or degenerate into smudged plastic shapes.",
    keyTakeaway: "Distorted keypads and warped office hardware serve as strong indicators of AI-generated flaws."
},

{
    id: "O3",
    category: "object",
    x: 84.8,
    y: 58.7,
    title: "The Melted Keyboard ",
    issue: "The keyboard features uniform, melted rows of keys that lack individual shape, distinct spacing, or a recognizable QWERTY layout.",
    explanation: "AI generators struggle to replicate complex grids of repetitive objects like small keyboard keys, resulting in a smeared or texturized block instead of separate buttons.",
    inspectionTip: "Look closely at the keys to see if they form distinct, pressable button caps or blur together into a solid plastic texture.",
    keyTakeaway: "A smeared or structurally uniform keyboard layout serves as a classic indicator of AI generation failure."
},

{
    id: "S1",
    category: "scene",
    x: 68.7,
    y: 67.4,
    title: "Wrong Donation ",
    issue: "The objects inside the DONATIONS jar are not currency or coins; they appear to be miniature rectangular ID badges or keycards that match the layout of the name tag lanyards lined up on the desk.",
    explanation: "AI generators often hallucinate content by bleeding or repurposing visual elements from elsewhere in the prompt or scene such as the name tags on the table and placing them inside containers where they make no logical sense.",
    inspectionTip: "Look closely at the contents of jars, bowls, or containers to check if the objects inside match what should logically be there or if they look like recycled props from the surrounding environment.",
    keyTakeaway: "Placing non-sensical or duplicated scene objects inside containers highlights a classic AI scene logic failure."
},

{
    id: "S2",
    category: "scene",
    x: 38.1,
    y: 2,
    title: "Wall Device Placement",
    issue: "An electrical switch or box is placed directly straddling the internal corner where two walls meet, making it physically impossible to mount flat.",
    explanation: "AI image generators often scatter architectural fixtures like outlets, switches, or vents onto walls without understanding real-world building codes, structural logic, or surface planes.",
    inspectionTip: "Check wall-mounted fixtures to ensure they sit completely flat on a single continuous surface rather than wrapping across room corners or junctions.",
    keyTakeaway: "Fixtures placed across impossible architectural angles serve as a classic example of a scene logic error."
},

{
    id: "S3",
    category: "scene",
    x: 19.5,
    y: 59.1,
    title: "The Cat Head Carrier",
    issue: "The cat's head emerging from the top of the carrier appears unnaturally fused with the structure, lacking a proper neck connection or natural physical integration.",
    explanation: "AI generators often struggle with spatial logic and anatomical consistency when combining separate objects, resulting in awkward clipping or merging.",
    inspectionTip: "Examine the points where subjects, animals, or objects intersect to ensure boundaries and proportions follow physical laws.",
    keyTakeaway: "Unnatural anatomical merging and impossible spatial integration are strong indicators of AI-generated imagery."
},

{
    id: "C1",
    category: "count",
    x: 31.6,
    y: 62,
    title: "Incorrect Number of Cats",
    issue: "The prompt specifies three cats, but four appear in the image.",
    explanation: "Counting multiple similar objects remains difficult for many AI models.",
    inspectionTip: "Compare the image directly with the original prompt.",
    keyTakeaway: "Always verify quantities instead of estimating."
}

]

    }

};


/* ----------------------------------------------------------
   Initialize Explorer
---------------------------------------------------------- */

function initializeExplorer() {

    loadScene("veterinaryClinic");

    const sceneSelector = document.getElementById("sceneSelector");
    const categoryFilter = document.getElementById("categoryFilter");
    const annotationSearch = document.getElementById("annotationSearch");
    const resetExplorer = document.getElementById("resetExplorer");

    if (sceneSelector) {

        sceneSelector.addEventListener("change", (event) => {

            loadScene(event.target.value);

        });

    }

    if (categoryFilter) {

        categoryFilter.addEventListener("change", (event) => {

            explorer.categoryFilter = event.target.value;

            renderHotspots();

        });

    }

    if (annotationSearch) {

        annotationSearch.addEventListener("input", () => {

            renderHotspots();

        });

    }

    if (resetExplorer) {

        resetExplorer.addEventListener("click", () => {

            explorer.categoryFilter = "all";

            if (categoryFilter) categoryFilter.value = "all";

            if (annotationSearch) annotationSearch.value = "";

            renderHotspots();

            if (explorer.annotations.length) {

                selectAnnotation(explorer.annotations[0].id);

            }

        });

    }

}


/* ----------------------------------------------------------
   Load Scene
---------------------------------------------------------- */

function loadScene(scene) {

    const data = annotationDatabase[scene];

    if (!data) {

        console.error("Scene not found:", scene);

        return;

    }

    explorer.image = scene;
    explorer.annotations = data.annotations;
    explorer.categoryFilter = "all";

    const image = document.getElementById("trainingImage");
    const prompt = document.getElementById("originalPrompt");
    const categoryFilter = document.getElementById("categoryFilter");
    const annotationSearch = document.getElementById("annotationSearch");

    if (image) {

        image.src = data.image;
        image.alt = scene;

    }

    if (prompt) {

        prompt.textContent = data.prompt;

    }

    if (categoryFilter) {

        categoryFilter.value = "all";

    }

    if (annotationSearch) {

        annotationSearch.value = "";

    }

    updateCategoryCounts(data.annotations);

    renderHotspots();

    if (explorer.annotations.length) {

        selectAnnotation(explorer.annotations[0].id);

    }

}


/* ----------------------------------------------------------
   Update Category Counts
---------------------------------------------------------- */

function updateCategoryCounts(annotations) {

    const counts = {

        text: 0,
        anatomy: 0,
        object: 0,
        scene: 0,
        count: 0

    };

    annotations.forEach(annotation => {

        if (counts.hasOwnProperty(annotation.category)) {

            counts[annotation.category]++;

        }

    });

    const idMap = {
        text: "count-text",
        anatomy: "count-anatomy",
        object: "count-object",
        scene: "count-scene",
        count: "count-count"
    };

    Object.entries(idMap).forEach(([category, id]) => {

        const element = document.getElementById(id);

        if (!element) {

            console.error(`Missing element: #${id}`);

            return;

        }

        element.textContent = counts[category];

    });

}


/* ----------------------------------------------------------
   Render Hotspots
---------------------------------------------------------- */

function renderHotspots() {

    const layer = document.getElementById("hotspotLayer");

    if (!layer) {
        console.error("Hotspot layer not found.");
        return;
    }

    layer.innerHTML = "";

    // Ensure the category filter always has a valid value
    const activeCategory = explorer.categoryFilter || "all";

    // Search box may not exist yet
    const searchBox = document.getElementById("annotationSearch");

    const search = searchBox
        ? searchBox.value.trim().toLowerCase()
        : "";

    const filteredAnnotations = explorer.annotations.filter(annotation => {

        const matchesCategory =
            activeCategory === "all" ||
            annotation.category === activeCategory;

        if (!search) {
            return matchesCategory;
        }

        const searchableText = [

            annotation.id,
            annotation.title,
            annotation.issue,
            annotation.explanation,
            annotation.inspectionTip,
            annotation.keyTakeaway

        ].join(" ").toLowerCase();

        return (
            matchesCategory &&
            searchableText.includes(search)
        );

    });

    console.log("Explorer annotations:", explorer.annotations.length);
    console.log("Filtered annotations:", filteredAnnotations.length);

    filteredAnnotations.forEach(annotation => {

        const hotspot = document.createElement("button");

        hotspot.type = "button";

        hotspot.className = `hotspot ${annotation.category}`;

        hotspot.dataset.id = annotation.id;

        hotspot.textContent = annotation.id;

        hotspot.style.position = "absolute";
        hotspot.style.left = annotation.x + "%";
        hotspot.style.top = annotation.y + "%";
        hotspot.style.transform = "translate(-50%, -50%)";

        hotspot.addEventListener("click", () => {

            selectAnnotation(annotation.id);

        });

        layer.appendChild(hotspot);

    });

    console.log("Hotspots rendered:", layer.children.length);

    const annotationTotal = document.getElementById("annotationTotal");

    if (annotationTotal) {

        annotationTotal.textContent =
            `${filteredAnnotations.length} / ${explorer.annotations.length}`;

    }

    highlightHotspot();

}

/* ----------------------------------------------------------
   Select Annotation
---------------------------------------------------------- */

function selectAnnotation(id) {

    explorer.selected = explorer.annotations.find(

        annotation => annotation.id === id

    );

    if (!explorer.selected) return;

    updateInspector();

    updateDeveloperPanel();

    highlightHotspot();

}


/* ----------------------------------------------------------
   Update Inspector
---------------------------------------------------------- */

function updateInspector() {

    const panel = document.getElementById("annotationContent");

    if (!panel) return;

    if (!explorer.selected) {

        panel.innerHTML = "";

        return;

    }

    const annotation = explorer.selected;

    const categories = {

        text: "🟦 Text Rendering",
        anatomy: "🟨 Anatomy",
        object: "🟪 Object Integrity",
        scene: "🟥 Scene Logic",
        count: "🟩 Counting"

    };

    panel.innerHTML = `

        <h3>${annotation.id} • ${annotation.title}</h3>

        <div class="annotation-meta">

            <span class="badge">

                ${categories[annotation.category]}

            </span>

        </div>

        <hr>

        <h4>What is the issue?</h4>

        <p>${annotation.issue}</p>

        <h4>Why does this happen?</h4>

        <p>${annotation.explanation}</p>

        <h4>How do you inspect it?</h4>

        <p>${annotation.inspectionTip}</p>

        <h4>Key Takeaway</h4>

        <p>${annotation.keyTakeaway}</p>

    `;

}


/* ----------------------------------------------------------
   Highlight Selected Hotspot
---------------------------------------------------------- */

function highlightHotspot() {

    if (!explorer.selected) return;

    document.querySelectorAll(".hotspot").forEach(hotspot => {

        hotspot.classList.toggle(

            "selected",

            hotspot.dataset.id === explorer.selected.id

        );

    });

}


/* ==========================================================
   TAB 4 - FINAL ASSESSMENT
========================================================== */

/* ==========================================================
   ASSESSMENT STATE
========================================================== */

const assessment = {
    currentQuestion: 0,
    score: 0,
    answers: []
};

/* ==========================================================
   INITIALIZE ASSESSMENT
========================================================== */

function initializeAssessment(){

    assessment.currentQuestion = 0;
    assessment.score = 0;
    assessment.answers = [];

    const quiz =
        document.getElementById("quizSection");

    const results =
        document.getElementById("resultsSection");

    if(quiz){
        quiz.classList.add("hidden");
    }

    if(results){
        results.classList.add("hidden");
    }

}

/* ----------------------------------------------------------
   Show Quiz
---------------------------------------------------------- */

function showQuiz(){

    document
        .querySelector("#tab4 > .section")
        .classList.add("hidden");

    document
        .getElementById("quizSection")
        .classList.remove("hidden");

}

/* ==========================================================
   QUESTION BANK
========================================================== */

const quizQuestions = [

{
    id:1,
    category:"Text Rendering",
    question:"Which AI artifact is most commonly associated with signs, posters, and labels?",
    options:[
        "Incorrect object count",
        "Distorted or unreadable text",
        "Lighting inconsistency",
        "Oversaturated colors"
    ],
    answer:1,
    explanation:"AI-generated images frequently produce unreadable, misspelled, or distorted text."
},

{
    id:2,
    category:"Text Rendering",
    question:"You notice a donation jar labeled 'ODDATIONS' instead of 'DONATIONS.' Which category does this belong to?",
    options:[
        "Anatomy",
        "Text Rendering",
        "Counting",
        "Scene Logic"
    ],
    answer:1,
    explanation:"Misspelled or garbled words are classic text rendering artifacts."
},

{
    id:3,
    category:"Text Rendering",
    question:"What is the best way to inspect printed text in an image?",
    options:[
        "Ignore small text because AI often blurs it.",
        "Judge only the font style.",
        "Zoom in and check whether the words remain readable and correctly spelled.",
        "Compare the color of the letters."
    ],
    answer:2,
    explanation:"Zooming in helps reveal subtle text rendering errors that may not be obvious at first glance."
},

{
    id:4,
    category:"Anatomy",
    question:"A cat has distorted eyes and an unnatural facial structure. Which category best describes this issue?",
    options:[
        "Anatomy",
        "Scene Logic",
        "Counting",
        "Text Rendering"
    ],
    answer:0,
    explanation:"Facial distortions are anatomy-related issues."
},

{
    id:5,
    category:"Anatomy",
    question:"Why are teeth often useful when evaluating AI-generated faces?",
    options:[
        "Teeth are usually brighter than skin.",
        "AI often merges or distorts individual teeth into unnatural shapes.",
        "Teeth determine a person's age.",
        "Teeth are always perfectly symmetrical."
    ],
    answer:1,
    explanation:"Teeth are one of the most common facial artifacts produced by image generation models."
},

{
    id:6,
    category:"Anatomy",
    question:"When examining people or animals, which feature should be inspected carefully?",
    options:[
        "Clothing color",
        "Shadows only",
        "Facial features, eyes, mouth, and anatomical structure",
        "Background objects"
    ],
    answer:2,
    explanation:"Always inspect anatomical structures rather than relying on the overall appearance."
},

{
    id:7,
    category:"Object Integrity",
    question:"A telephone has melted buttons and a warped keypad. Which category does this belong to?",
    options:[
        "Anatomy",
        "Object Integrity",
        "Counting",
        "Scene Logic"
    ],
    answer:1,
    explanation:"Structural distortions of objects indicate object integrity problems."
},

{
    id:8,
    category:"Object Integrity",
    question:"AI models often struggle with keyboards because they contain:",
    options:[
        "Bright colors",
        "Many small, repetitive objects arranged in precise patterns",
        "Reflective surfaces",
        "Large flat areas"
    ],
    answer:1,
    explanation:"Repeating patterns are difficult for many image generation models."
},

{
    id:9,
    category:"Object Integrity",
    question:"What should you inspect when two objects overlap?",
    options:[
        "Whether both objects are the same color",
        "The brightness of the image",
        "Whether their edges blend together unnaturally",
        "Whether the objects cast shadows"
    ],
    answer:2,
    explanation:"AI frequently produces merged or blended object boundaries."
},

{
    id:10,
    category:"Scene Logic",
    question:"An electrical switch is mounted across the corner where two walls meet. This is an example of:",
    options:[
        "Anatomy",
        "Scene Logic",
        "Counting",
        "Text Rendering"
    ],
    answer:1,
    explanation:"Objects placed in physically impossible locations are scene logic errors."
},

{
    id:11,
    category:"Scene Logic",
    question:"A donation jar contains ID badges instead of money. What type of AI error is this?",
    options:[
        "Object Integrity",
        "Scene Logic",
        "Counting",
        "Anatomy"
    ],
    answer:1,
    explanation:"The object itself is intact, but its contents are illogical."
},

{
    id:12,
    category:"Scene Logic",
    question:"A cat appears fused into the top of its carrier. Which category best describes this issue?",
    options:[
        "Text Rendering",
        "Scene Logic",
        "Counting",
        "Lighting"
    ],
    answer:1,
    explanation:"Merged objects violate the physical logic of the scene."
},

{
    id:13,
    category:"Counting",
    question:"The prompt specifies three cats, but the generated image contains four. Which category does this belong to?",
    options:[
        "Scene Logic",
        "Counting",
        "Object Integrity",
        "Anatomy"
    ],
    answer:1,
    explanation:"The generated image does not match the requested quantity."
},

{
    id:14,
    category:"Counting",
    question:"When evaluating quantities in an AI-generated image, what should you do first?",
    options:[
        "Estimate the number of objects.",
        "Compare the image directly with the prompt.",
        "Count only foreground objects.",
        "Ignore background objects."
    ],
    answer:1,
    explanation:"Always compare the image against what the prompt actually requested."
},

{
    id:15,
    category:"General Inspection",
    question:"Which inspection strategy is the most effective when evaluating AI-generated images?",
    options:[
        "Focus only on the largest objects.",
        "Judge the overall realism at first glance.",
        "Search only for anatomy errors.",
        "Inspect the image systematically by checking text, anatomy, objects, scene logic, and counting."
    ],
    answer:3,
    explanation:"A systematic inspection process helps you catch subtle artifacts across multiple categories."
}

];



/* ==========================================================
   START QUIZ
========================================================== */

function startQuiz(){

    assessment.currentQuestion = 0;

    assessment.score = 0;

    assessment.answers =
        new Array(quizQuestions.length).fill(null);

    document
        .querySelector("#tab4 > .section")
        .classList.add("hidden");

    document
        .getElementById("quizSection")
        .classList.remove("hidden");

    renderQuestion();

}

/* ==========================================================
   RENDER QUESTION
========================================================== */

function renderQuestion(){

    const question =
        quizQuestions[assessment.currentQuestion];

    document.getElementById("questionNumber").textContent =
        `Question ${assessment.currentQuestion + 1} of ${quizQuestions.length}`;

    document.getElementById("questionCategory").textContent =
        question.category;

    document.getElementById("questionText").textContent =
        question.question;

    const options =
        document.getElementById("questionOptions");

    options.innerHTML = "";

    question.options.forEach((option,index)=>{

        const label =
            document.createElement("label");

        label.innerHTML = `
            <input
                type="radio"
                name="quizAnswer"
                value="${index}"
                ${assessment.answers[assessment.currentQuestion]===index ? "checked" : ""}
            >
            <span>${option}</span>
        `;

        options.appendChild(label);

    });

    updateButtons();

}

/* ==========================================================
   SAVE ANSWER
========================================================== */

function saveAnswer(){

    const selected =
        document.querySelector(
            'input[name="quizAnswer"]:checked'
        );

    if(selected){

        assessment.answers[
            assessment.currentQuestion
        ] = Number(selected.value);

    }

}

/* ==========================================================
   NEXT
========================================================== */

function nextQuestion(){

    saveAnswer();

    if(
        assessment.currentQuestion <
        quizQuestions.length - 1
    ){

        assessment.currentQuestion++;

        renderQuestion();

    }

}

/* ==========================================================
   PREVIOUS
========================================================== */

function previousQuestion(){

    saveAnswer();

    if(
        assessment.currentQuestion > 0
    ){

        assessment.currentQuestion--;

        renderQuestion();

    }

}

/* ==========================================================
   BUTTONS
========================================================== */

function updateButtons(){

    document
        .getElementById("previousQuestion")
        .disabled =
        assessment.currentQuestion===0;

    if(
        assessment.currentQuestion ===
        quizQuestions.length-1
    ){

        document
            .getElementById("nextQuestion")
            .classList.add("hidden");

        document
            .getElementById("submitQuiz")
            .classList.remove("hidden");

    }else{

        document
            .getElementById("nextQuestion")
            .classList.remove("hidden");

        document
            .getElementById("submitQuiz")
            .classList.add("hidden");

    }

}

/* ==========================================================
   RESULTS
========================================================== */

function showResults(){

    saveAnswer();

    assessment.score = 0;

    quizQuestions.forEach((question,index)=>{

        if(
            assessment.answers[index] ===
            question.answer
        ){

            assessment.score++;

        }

    });

    document
        .getElementById("quizSection")
        .classList.add("hidden");

    document
        .getElementById("resultsSection")
        .classList.remove("hidden");

    document.getElementById("finalScore").textContent =
        `${assessment.score}/${quizQuestions.length}`;

    const percent =
        Math.round(
            assessment.score /
            quizQuestions.length *
            100
        );

    let message = "";

    if(percent >= 90){

        message =
            "Outstanding! You have an excellent understanding of common AI image artifacts.";

    }else if(percent >= 75){

        message =
            "Great job! You can identify most AI image artifacts with confidence.";

    }else if(percent >= 60){

        message =
            "Good effort. Review the lesson materials to strengthen your inspection skills.";

    }else{

        message =
            "Keep practicing. Revisit the training modules and try the assessment again.";

    }

    document
        .getElementById("scoreMessage")
        .textContent =
        message;

    document
        .getElementById("scoreBreakdown")
        .innerHTML = `
            <p>
                <span>Correct Answers</span>
                <strong>${assessment.score}</strong>
            </p>

            <p>
                <span>Incorrect Answers</span>
                <strong>${quizQuestions.length-assessment.score}</strong>
            </p>

            <p>
                <span>Score</span>
                <strong>${percent}%</strong>
            </p>
        `;

}

/* ==========================================================
   RETAKE ASSESSMENT
========================================================== */

function retakeAssessment(){

    document
        .getElementById("resultsSection")
        .classList.add("hidden");

    document
        .querySelector("#tab4 > .section")
        .classList.remove("hidden");

    startQuiz();

}

/* ----------------------------------------------------------
   Developer Coordinate Picker
---------------------------------------------------------- */

function initializeDeveloperPicker(){

    const container =
        document.getElementById("hotspotLayer");

    if(!container) return;

    container.addEventListener("click",(event)=>{

        if(!explorer.developerMode) return;

        if(!explorer.selected) return;

        if(event.target.classList.contains("hotspot"))
            return;

        const image =
            document.getElementById("trainingImage");

        const rect =
            image.getBoundingClientRect();

        const x =
            ((event.clientX - rect.left) /
            rect.width) * 100;

        const y =
            ((event.clientY - rect.top) /
            rect.height) * 100;

        explorer.selected.x =
            Number(x.toFixed(1));

        explorer.selected.y =
            Number(y.toFixed(1));

        updateDeveloperPanel();

        highlightHotspot();

        renderHotspots();

        selectAnnotation(explorer.selected.id);

    });

}

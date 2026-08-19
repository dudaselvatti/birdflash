import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';
import {
    getStorage,
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js';

const firebaseConfig = {
    apiKey: 'AIzaSyAP3f5jOX32azxLX5R04999mNUxYj1gO8E',
    authDomain: 'birdflash-duda-julia.firebaseapp.com',
    projectId: 'birdflash-duda-julia',
    storageBucket: 'birdflash-duda-julia.firebasestorage.app',
    messagingSenderId: '530969635496',
    appId: '1:530969635496:web:8565f495fa5541f843f09d'
};

const PEOPLE = {
    hDN8IUQ0kJW29pS2n0ukDRBaS4J3: {
        key: 'duda',
        name: 'duda',
        email: 'duda@birdflash.app'
    },
    '0sKeNdvbFWPtDKUFiNyp2Brtqvk1': {
        key: 'julia',
        name: 'júlia',
        email: 'julia@birdflash.app'
    }
};

const LOGIN_CANDIDATES = [
    PEOPLE.hDN8IUQ0kJW29pS2n0ukDRBaS4J3,
    PEOPLE['0sKeNdvbFWPtDKUFiNyp2Brtqvk1']
];

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const els = {
    grid: document.getElementById('coded-grid'),
    addToggle: document.getElementById('coded-add-toggle'),
    pinWrap: document.getElementById('coded-pin-wrap'),
    pin: document.getElementById('coded-pin'),
    pinSubmit: document.getElementById('coded-pin-submit'),
    authFeedback: document.getElementById('coded-auth-feedback'),
    session: document.getElementById('coded-session'),
    sessionName: document.getElementById('coded-session-name'),
    lock: document.getElementById('coded-lock'),
    formWrap: document.getElementById('coded-form-wrap'),
    form: document.getElementById('coded-form'),

    kindButtons: [...document.querySelectorAll('[data-coded-kind]')],

    title: document.getElementById('coded-title'),
    titleLabel: document.getElementById('coded-title-label'),

    reason: document.getElementById('coded-reason'),
    reasonLabel: document.getElementById('coded-reason-label'),

    roles: document.getElementById('coded-roles'),
    rolesField: document.getElementById('coded-roles-field'),
    rolesLabel: document.getElementById('coded-roles-label'),

    file: document.getElementById('coded-photo-file'),
    file: document.getElementById('coded-photo-file'),
    preview: document.getElementById('coded-upload-preview'),
    previewImage: document.getElementById('coded-upload-preview-image'),
    clearPhoto: document.getElementById('coded-upload-clear'),
    progress: document.getElementById('coded-upload-progress'),
    progressText: document.getElementById('coded-upload-progress-text'),
    progressPercent: document.getElementById('coded-upload-progress-percent'),
    progressBar: document.getElementById('coded-upload-progress-bar'),
    submit: document.getElementById('coded-submit'),
    feedback: document.getElementById('coded-feedback')
};

let currentPerson = null;
let remoteCodeds = [];
let previewObjectUrl = null;
let isSubmitting = false;

const CODED_KIND_CONFIG = {
    pair: {
        titleLabel: 'qual é a dupla ou casal?',
        titlePlaceholder: 'ex.: root + shaw',

        rolesVisible: true,
        rolesLabel: 'quem é quem? (opcional)',
        rolesPlaceholder: 'ex.: duda é X e júlia é Y',

        reasonLabel: 'por que isso é a nossa cara?',
        reasonPlaceholder: 'deixa a acusação registrada aqui...'
    },

    person: {
        titleLabel: 'quem é a referência?',
        titlePlaceholder: 'ex.: megan, batman, uma personagem...',

        rolesVisible: true,
        rolesLabel: 'quem isso te lembra? (opcional)',
        rolesPlaceholder: 'ex.: você / eu / nós duas',

        reasonLabel: 'por que essa pessoa ou personagem é coded?',
        reasonPlaceholder: 'explica as evidências...'
    },

    music: {
        titleLabel: 'qual música?',
        titlePlaceholder: 'ex.: bags — clairo',

        rolesVisible: false,

        reasonLabel: 'por que essa música é coded?',
        reasonPlaceholder: 'qual pedacinho dela fez você pensar na gente?'
    },

    scene: {
        titleLabel: 'qual cena ou meme?',
        titlePlaceholder: 'ex.: aquela cena de..., aquele meme da...',

        rolesVisible: true,
        rolesLabel: 'tem um “quem é quem”? (opcional)',
        rolesPlaceholder: 'ex.: eu sou a da esquerda e você é a outra',

        reasonLabel: 'por que isso é a nossa cara?',
        reasonPlaceholder: 'registre a acusação KKKKKKK'
    },

    other: {
        titleLabel: 'o que é?',
        titlePlaceholder: 'ex.: uma frase, lugar, objeto, situação...',

        rolesVisible: true,
        rolesLabel: 'algum detalhe? (opcional)',
        rolesPlaceholder: 'qualquer informação que ajude a entender',

        reasonLabel: 'por que isso é coded?',
        reasonPlaceholder: 'me explica como a gente veio parar nisso...'
    }
};

function setCodedKind(kind) {
    const config = CODED_KIND_CONFIG[kind] || CODED_KIND_CONFIG.pair;

    els.kindButtons.forEach(button => {
        const active = button.dataset.codedKind === kind;

        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    setText(els.titleLabel, config.titleLabel);
    setText(els.reasonLabel, config.reasonLabel);

    if (els.title) {
        els.title.placeholder = config.titlePlaceholder;
    }

    if (els.reason) {
        els.reason.placeholder = config.reasonPlaceholder;
    }

    if (els.rolesField) {
        els.rolesField.hidden = !config.rolesVisible;
    }

    if (config.rolesVisible) {
        setText(els.rolesLabel, config.rolesLabel);

        if (els.roles) {
            els.roles.placeholder = config.rolesPlaceholder;
        }
    } else if (els.roles) {
        /*
         * Se ela escreveu "quem é quem?" e depois mudou para música,
         * não queremos mandar aquele valor escondido pro Firebase.
         */
        els.roles.value = '';
    }
}

function setText(element, text = '') {
    if (element) element.textContent = text;
}

function humanizeFirebaseError(error) {
    const code = error?.code || '';

    if (code === 'auth/too-many-requests') {
        return 'muitas tentativas seguidas :( espera um pouquinho e tenta de novo.';
    }

    if (code.startsWith('auth/')) {
        return 'pin não reconhecido. ou você é uma impostora ou digitou errado ♡';
    }

    if (code === 'storage/unauthorized' || code === 'permission-denied') {
        return 'o firebase não deixou fazer isso. confere se as regras foram publicadas.';
    }

    return 'deu alguma coisinha errada agora :( tenta novamente.';
}

function closePin() {
    if (els.pinWrap) els.pinWrap.hidden = true;
    if (els.pin) els.pin.value = '';
    setText(els.authFeedback, '');
}

function closeForm() {
    if (els.formWrap) els.formWrap.hidden = true;
}

function openPin() {
    closeForm();
    if (els.pinWrap) els.pinWrap.hidden = false;
    if (els.addToggle) {
        els.addToggle.setAttribute('aria-expanded', 'true');
        els.addToggle.textContent = '− fechar acesso';
    }
    window.setTimeout(() => els.pin?.focus(), 30);
}

function openForm() {
    closePin();
    if (els.formWrap) els.formWrap.hidden = false;
    if (els.addToggle) {
        els.addToggle.setAttribute('aria-expanded', 'true');
        els.addToggle.textContent = '− fechar cadastro';
    }
    window.setTimeout(() => els.title?.focus(), 30);
}

function closeEditorPanels() {
    closePin();
    closeForm();
    if (els.addToggle) {
        els.addToggle.setAttribute('aria-expanded', 'false');
        els.addToggle.textContent = '+ adicionar ao arquivo';
    }
}

function updateAuthUI(user) {
    currentPerson = user ? PEOPLE[user.uid] || null : null;

    if (currentPerson) {
        if (els.session) els.session.hidden = false;
        setText(els.sessionName, currentPerson.name);
    } else {
        if (els.session) els.session.hidden = true;
        closeForm();
    }

    renderCustomCodeds();
}

async function unlockWithPin() {
    const pin = els.pin?.value.trim() || '';
    if (!pin) {
        setText(els.authFeedback, 'faltou o pin, criatura ♡');
        return;
    }

    if (els.pinSubmit) els.pinSubmit.disabled = true;
    setText(els.authFeedback, 'checando evidências...');

    let lastError = null;

    for (const candidate of LOGIN_CANDIDATES) {
        try {
            const credential = await signInWithEmailAndPassword(auth, candidate.email, pin);
            const person = PEOPLE[credential.user.uid];

            if (!person) {
                await signOut(auth);
                throw new Error('Conta autenticada não está autorizada neste Birdflash.');
            }

            setText(els.authFeedback, `acesso liberado, ${person.name} ♡`);
            if (els.pin) els.pin.value = '';
            window.setTimeout(openForm, 220);
            if (els.pinSubmit) els.pinSubmit.disabled = false;
            return;
        } catch (error) {
            lastError = error;
        }
    }

    setText(els.authFeedback, humanizeFirebaseError(lastError));
    if (els.pinSubmit) els.pinSubmit.disabled = false;
    els.pin?.focus();
}

function clearSelectedPhoto() {
    if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
        previewObjectUrl = null;
    }

    if (els.file) els.file.value = '';
    if (els.previewImage) els.previewImage.removeAttribute('src');
    if (els.preview) els.preview.hidden = true;
}

function validateSelectedImage(file) {
    if (!file) return null;

    if (!file.type || !file.type.startsWith('image/')) {
        return 'esse arquivo não parece ser uma imagem.';
    }

    if (file.size >= MAX_IMAGE_BYTES) {
        return 'essa foto passou de 8 MB. escolhe uma menor ou manda um print dela ♡';
    }

    return null;
}

function showSelectedPhoto(file) {
    const validationError = validateSelectedImage(file);
    if (validationError) {
        clearSelectedPhoto();
        setText(els.feedback, validationError);
        return;
    }

    setText(els.feedback, '');

    if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
    previewObjectUrl = URL.createObjectURL(file);

    if (els.previewImage) els.previewImage.src = previewObjectUrl;
    if (els.preview) els.preview.hidden = false;
}

function setUploadProgress(percent, text = 'enviando imagem...') {
    const safePercent = Math.max(0, Math.min(100, Math.round(percent)));
    if (els.progress) els.progress.hidden = false;
    setText(els.progressText, text);
    setText(els.progressPercent, `${safePercent}%`);
    if (els.progressBar) els.progressBar.style.width = `${safePercent}%`;
}

function resetUploadProgress() {
    if (els.progress) els.progress.hidden = true;
    if (els.progressBar) els.progressBar.style.width = '0%';
    setText(els.progressPercent, '0%');
    setText(els.progressText, 'enviando imagem...');
}

function extensionFromFile(file) {
    const fromName = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    if (fromName && fromName.length <= 8) return fromName;

    const fromType = file.type.split('/')[1]?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    return fromType || 'jpg';
}

function makeStoragePath(file) {
    const id = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return `codeds/${Date.now()}-${id}.${extensionFromFile(file)}`;
}

function uploadImage(file) {
    return new Promise((resolve, reject) => {
        const path = makeStoragePath(file);
        const imageRef = storageRef(storage, path);
        const uploadTask = uploadBytesResumable(imageRef, file, {
            contentType: file.type
        });

        uploadTask.on(
            'state_changed',
            snapshot => {
                const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(percent);
            },
            reject,
            async () => {
                try {
                    const photoURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setUploadProgress(100, 'imagem enviada ♡');
                    resolve({ photoURL, storagePath: path });
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
}

function createCustomCodedCard(coded, index) {
    const card = document.createElement('article');
    card.className = 'coded-card coded-card-custom';
    card.dataset.codedId = coded.id;

    const top = document.createElement('div');
    top.className = 'coded-card-top';

    const number = document.createElement('span');
    number.className = 'coded-number';
    number.textContent = `coded #${String(index + 3).padStart(3, '0')}`;

    const badge = document.createElement('span');
    badge.className = 'coded-badge';
    const author = coded.addedBy === 'duda' ? 'duda' : coded.addedBy === 'júlia' ? 'júlia' : 'uma de nós';
    badge.textContent = `adicionado pela ${author} ♡`;

    top.append(number, badge);
    card.appendChild(top);

    const body = document.createElement('div');
    body.className = 'coded-body';

    const media = document.createElement('div');
    media.className = 'coded-media';

    const figure = document.createElement('figure');
    figure.className = 'coded-photo-card coded-photo-card-single';

    const frame = document.createElement('div');
    frame.className = 'coded-photo-frame';

    if (coded.photoURL) {
        const img = document.createElement('img');
        img.src = coded.photoURL;
        img.alt = `imagem de referência de ${coded.title}`;
        img.loading = 'lazy';
        frame.appendChild(img);
    } else {
        frame.classList.add('coded-photo-placeholder', 'coded-photo-generic');
        frame.textContent = coded.title;
    }

    const caption = document.createElement('figcaption');
    caption.textContent = 'imagem de referência ♡';

    figure.append(frame, caption);
    media.appendChild(figure);

    const content = document.createElement('div');
    content.className = 'coded-content';

    const title = document.createElement('h3');
    title.textContent = coded.title;
    content.appendChild(title);

    if (coded.roles) {
        const roles = document.createElement('p');
        roles.className = 'coded-roles';
        roles.textContent = coded.roles;
        content.appendChild(roles);
    }

    if (coded.reason) {
        const reason = document.createElement('p');
        reason.className = 'coded-note';
        reason.textContent = coded.reason;
        content.appendChild(reason);
    }

    const signature = document.createElement('span');
    signature.className = 'coded-signature';
    signature.textContent = author === 'júlia'
        ? '— registrado pela minha shaw'
        : author === 'duda'
            ? '— registrado pela duda'
            : '— registrado no nosso arquivo';
    content.appendChild(signature);

    body.append(media, content);
    card.appendChild(body);

    if (currentPerson) {
        const remove = document.createElement('button');
        remove.className = 'coded-remove';
        remove.type = 'button';
        remove.setAttribute('aria-label', `remover ${coded.title} do arquivo`);
        remove.textContent = '×';
        remove.addEventListener('click', () => removeCoded(coded, remove));
        card.appendChild(remove);
    }

    return card;
}

function renderCustomCodeds() {
    if (!els.grid) return;

    els.grid.querySelectorAll('.coded-card-custom').forEach(card => card.remove());

    remoteCodeds.forEach((coded, index) => {
        els.grid.appendChild(createCustomCodedCard(coded, index));
    });
}

async function removeCoded(coded, button) {
    if (!currentPerson) {
        openPin();
        return;
    }

    const confirmed = window.confirm(`remover “${coded.title}” do arquivo?`);
    if (!confirmed) return;

    button.disabled = true;
    setText(els.feedback, 'removendo do arquivo...');

    try {
        if (coded.storagePath) {
            try {
                await deleteObject(storageRef(storage, coded.storagePath));
            } catch (error) {
                if (error?.code !== 'storage/object-not-found') throw error;
            }
        }

        await deleteDoc(doc(db, 'codeds', coded.id));
        setText(els.feedback, 'removido do arquivo.');
        window.setTimeout(() => setText(els.feedback, ''), 1800);
    } catch (error) {
        console.error('Erro ao remover item:', error);
        setText(els.feedback, humanizeFirebaseError(error));
        button.disabled = false;
    }
}

async function submitCoded(event) {
    event.preventDefault();
    if (isSubmitting) return;

    if (!auth.currentUser || !currentPerson) {
        setText(els.feedback, 'destrava o arquivo primeiro ♡');
        openPin();
        return;
    }

    const title = els.title?.value.trim() || '';
    const reason = els.reason?.value.trim() || '';
    const roles = els.roles?.value.trim() || '';
    const file = els.file?.files?.[0] || null;

    if (!title) {
        setText(els.feedback, 'faltou dizer qual é a referência, criatura.');
        els.title?.focus();
        return;
    }

    const validationError = validateSelectedImage(file);
    if (validationError) {
        setText(els.feedback, validationError);
        return;
    }

    isSubmitting = true;
    if (els.submit) els.submit.disabled = true;
    setText(els.feedback, file ? 'salvando a foto e a fofoca...' : 'registrando no arquivo...');

    let uploaded = null;

    try {
        if (file) uploaded = await uploadImage(file);

        await addDoc(collection(db, 'codeds'), {
            title,
            reason,
            roles,
            photoURL: uploaded?.photoURL || '',
            storagePath: uploaded?.storagePath || '',
            addedBy: currentPerson.name,
            ownerUid: auth.currentUser.uid,
            createdAt: serverTimestamp(),
            createdAtMs: Date.now()
        });

        els.form?.reset();
        setCodedKind('pair');
        clearSelectedPhoto();
        resetUploadProgress();
        setText(els.feedback, `registrado por ${currentPerson.name} com sucesso ♡`);
        window.setTimeout(() => setText(els.feedback, ''), 2600);
    } catch (error) {
        console.error('Erro ao cadastrar item:', error);

        if (uploaded?.storagePath) {
            try {
                await deleteObject(storageRef(storage, uploaded.storagePath));
            } catch (cleanupError) {
                console.warn('Não foi possível limpar upload órfão:', cleanupError);
            }
        }

        resetUploadProgress();
        setText(els.feedback, humanizeFirebaseError(error));
    } finally {
        isSubmitting = false;
        if (els.submit) els.submit.disabled = false;
    }
}

function subscribeToCodeds() {
    if (!els.grid) return;

    onSnapshot(
        collection(db, 'codeds'),
        snapshot => {
            remoteCodeds = snapshot.docs
                .map(item => ({ id: item.id, ...item.data() }))
                .sort((a, b) => (a.createdAtMs || 0) - (b.createdAtMs || 0));
            renderCustomCodeds();
        },
        error => {
            console.error('Erro ao acompanhar o arquivo:', error);
            setText(els.feedback, 'não consegui sincronizar o arquivo com o firebase :(');
        }
    );
}

els.kindButtons.forEach(button => {
    button.addEventListener('click', () => {
        setCodedKind(button.dataset.codedKind);
    });
});

setCodedKind('pair');

els.addToggle?.addEventListener('click', () => {
    const pinOpen = els.pinWrap && !els.pinWrap.hidden;
    const formOpen = els.formWrap && !els.formWrap.hidden;

    if (pinOpen || formOpen) {
        closeEditorPanels();
        return;
    }

    if (currentPerson) openForm();
    else openPin();
});

els.pinSubmit?.addEventListener('click', unlockWithPin);
els.pin?.addEventListener('keydown', event => {
    if (event.key === 'Enter') unlockWithPin();
});

els.lock?.addEventListener('click', async () => {
    closeEditorPanels();
    clearSelectedPhoto();
    await signOut(auth);
});

els.file?.addEventListener('change', () => {
    const file = els.file?.files?.[0] || null;
    if (!file) clearSelectedPhoto();
    else showSelectedPhoto(file);
});

els.clearPhoto?.addEventListener('click', clearSelectedPhoto);
els.form?.addEventListener('submit', submitCoded);

try {
    await setPersistence(auth, browserLocalPersistence);
} catch (error) {
    console.warn('Não foi possível definir persistência local do Firebase Auth:', error);
}

onAuthStateChanged(auth, user => updateAuthUI(user));
subscribeToCodeds();

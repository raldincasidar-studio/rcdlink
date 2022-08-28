<template>
    <main class="landing-page">
        <h1>RCDLINK</h1>
        <p>Link Generator to bypass banned links in facebook/twitter/instagram. Made with <span style="color: red">❤</span> by <a href="https://raldincasidar.ga/">@raldincasidar</a></p>
        <div class="input-container">
            <input :disabled="loading" v-model="url" autocomplete="off" type="url" id="url" placeholder=" ">
            <label for="url">Banned Website Link</label>
        </div>
        <p class="custom-meta" :disabled="loading" @click="custom_meta = !custom_meta">
            <input :disabled="loading" v-model="custom_meta" type="checkbox" id="custom">
            <label for="customer">Custom Meta</label>
        </p>
        <div class="options" v-if="custom_meta">
            <input :disabled="loading" v-model="meta.title" type="text" placeholder="Link Title">
            <input :disabled="loading" v-model="meta.description" type="text" placeholder="Link Description">
            <img :src="image_preview" v-if="image_preview" alt="">
            <input :disabled="loading" id="image" type="file" @change="previewImage" accept="image/*" placeholder="Image">
        </div>
        <button :disabled="!canCreateNewLink" @click="createNewLink" class="btn">{{ loading ? 'Loading ...' : 'LINKIFY' }}</button>
    </main>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Poppins;
  color: white;
}

:root {
  --black: #2b2e4a;
  --main: #e84545;
  --accent: #903749;
}

html {
  font-size: 16px;
}

html,
body {
  background-color: var(--black);
}

.landing-page {
  margin: auto;
  padding: 50px 15px;
  max-width: 600px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.landing-page h1 {
  font-size: 50px;
  color: white;
  margin: 20px 0;
  text-align: center;
}

.landing-page p {
  color: white;
  opacity: 0.7;
  margin: 10px 0;
  margin-bottom: 30px;
  text-align: center;
}

.input-container {
  width: 100%;
  position: relative;
  /* outline: 1px solid red; */
  margin-top: 20px;
}

.input-container label {
  font-size: 16px;
  margin: 16px;
  position: absolute;
  left: 0;
  top: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.input-container input:focus + label,
.input-container input:active + label,
.input-container input:not(:placeholder-shown) + label {
  margin: 0 6px;
  margin-top: -23px;
  font-size: 14px;
}

.input-container input {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.068);
  color: white;
  border: 2px solid white;
  border-radius: 10px;
  padding: 15px 20px;
  font-size: 17px;
  outline: 0;
}

.custom-meta {
  margin: 20px 0 !important;
  opacity: 1 !important;
}

.custom-meta input {
  margin-right: 10px;
}

.options {
  text-align: center;
}

.options input {
  background-color: rgba(255, 255, 255, 0.155);
  color: white;
  width: 100%;
  margin: 10px 0;
  padding: 15px 20px;
  border-radius: 10px;
  border: 2px solid transparent;
  font-size: 16px;
  outline: 0;
  font-family: poppins;
  transition: border-color 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.options input:focus,
.options input:active {
  border-color: white;
}

.options img {
  max-width: 100%;
  max-height: 400px;
  aspect-ratio: auto;
}

.btn {
  width: 100%;
  padding: 13px 15px;
  text-align: center;
  color: white;
  background-color: var(--accent);
  border: 0;
  border-radius: 10px;
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  font-family: poppins;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.208);
}

.btn:disabled {
  background-color: #422b30;
  color: white;
}
</style>

<script setup>
import { newLink, storage } from "@/services/firebase";
import {
  getDownloadURL,
  getStorage,
  ref as fbRef,
  uploadBytes,
} from "firebase/storage";

const url = ref("");
const custom_meta = ref(false);
const image_preview = ref("");
const loading = ref(false);

const meta = ref({
  title: "",
  description: "",
  image: image_preview.value,
});

function previewImage(evt) {
  const [file] = document.querySelector("#image").files;
  if (file) {
    image_preview.value = URL.createObjectURL(file);
  } else {
    image_preview.value = "";
  }
}

function getRandomInt(min = 1000000, max = 99999999) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createNewLink() {
  loading.value = true;

  console.log(url.value);
  console.log(custom_meta.value);
  console.log(meta.value);

  const data = {
    url: url.value,
  };

  if (custom_meta.value) {
    // Upload image first
    const file = document.querySelector("#image").files[0];
    const ext = file.name.split(".").pop();
    const fileRef = fbRef(storage, `upload${getRandomInt()}.${ext}`);

    const fileUpload = await uploadBytes(fileRef, file);

    const filepath = await getDownloadURL(fileUpload.ref);

    data["meta"] = {
      title: meta.value.title,
      description: meta.value.description,
      image: filepath,
    };
  } else {
    data["meta"] = {
      title: url.value,
      description: "URL Redirection using RCDLink",
      image: "https://rcdlink.vercel.app/og-image.png",
    };
  }

  console.log(data);

  let linkId;

  try {
    linkId = await newLink(data);
  } catch (error) {
    alert("Something is wrong!");
    console.log(error);
    loading.value = false;
    return;
  }

  const router = useRouter();
  router.push("/" + linkId);
}

const canCreateNewLink = computed(() => {
  if (!url.value) return false;

  if (
    // Check if legit website URL
    !url.value.match(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    )
  )
    return false;
  if (custom_meta.value) {
    if (!meta.value.title) return false;
    if (!meta.value.description) return false;
    if (!image_preview.value) return false;
  }

  if (loading.value) return false;

  return true;
});
</script>
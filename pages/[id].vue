<template>
    <main class="landing-page">
        <h1>You are redirecting to:</h1>
        <p> <a :href="data.fields.url.stringValue">{{ data.fields.url.stringValue }}</a> Powered by RCDLink. RCDLink is a tool to unblock your website URL on major social media platform. <nuxt-link to="/">Go try it</nuxt-link>!</p>
        <nuxt-link :href="data.fields.url.stringValue" class="btn">GO TO {{ data.fields.url.stringValue }}</nuxt-link>
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
  text-decoration: none;
}

.btn:disabled {
  background-color: #422b30;
  color: white;
}
</style>

<script setup>
import { getLink } from "@/services/firebase";

const $route = useRoute();
const $router = useRouter();
const id = $route.params.id;

const data = await $fetch(
  "https://firestore.googleapis.com/v1/projects/rcdlink/databases/(default)/documents/links/" +
    id
).catch((err) => {
  $router.push("/404");
  // error({ statusCode: 404, message: "Post not found" });
});

useHead({
  title: data.fields.meta.mapValue.fields.title.stringValue,
  meta: [
    {
      name: "title",
      content: data.fields.meta.mapValue.fields.title.stringValue,
    },
    {
      name: "description",
      content: data.fields.meta.mapValue.fields.description.stringValue,
    },
    { name: "og:type", content: "website" },
    {
      name: "og:title",
      content: data.fields.meta.mapValue.fields.title.stringValue,
    },
    {
      name: "og:description",
      content: data.fields.meta.mapValue.fields.description.stringValue,
    },
    {
      name: "og:image",
      content: data.fields.meta.mapValue.fields.image.stringValue,
    },
  ],
});

console.log(data);

console.log(data.fields.meta.mapValue.fields.title.stringValue);
// const { data } = await useAsyncData(async () => await getLink(id));
</script>
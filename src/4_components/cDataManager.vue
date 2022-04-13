<script setup lang="ts">
import { gsap } from 'gsap';
import { app, user, spells } from '@/3_stores';
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  await user.getUser();

  // If the user is signed in, get data
  if (user.isSignedIn) {
    loadData();
    return;
  }

  // If the user is not coming back from a provider, resolve the route
  if (!(route.name === 'home' && 'signin' in route.query)) {
    resolveRoute();
    return;
  }

  // User was redirected from a provider, so wait a sec before evaluating
  const wait = gsap.to(
    {},
    {
      duration: 1,
      onComplete: () => {
        if (user.isSignedIn) {
          loadData();
        } else {
          resolveRoute();
        }
      },
    }
  );

  app.supabase.auth.onAuthStateChange(async e => {
    if (e === 'SIGNED_IN') {
      await user.getUser();
      wait.progress(1);
    }
  });
});

async function loadData() {
  if (user.data.friends.length) {
    await user.getFriends();
  }
  await spells.getUserSpells();
  await spells.getAllSpells();

  resolveRoute();
}

function resolveRoute() {
  app.dataReady = true;

  if (route.name === 'home' && !user.isSignedIn) {
    router.replace({ name: 'index' });
  } else if (route.name === 'index' && user.isSignedIn) {
    router.replace({ name: 'home', query: {} });
  }
}
</script>

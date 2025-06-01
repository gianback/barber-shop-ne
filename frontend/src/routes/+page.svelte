<script>
	import About from '$lib/components/About.svelte';
	import Banner from '$lib/components/Banner.svelte';
	import Header from '$lib/components/Header.svelte';
	import Services from '$lib/components/Services.svelte';
	import Blogs from '$lib/components/Blogs.svelte';
	const { data } = $props();

	const { services, blogs } = data;
</script>

<Header />
<Banner />
<About />
<Services {services} />
<Blogs {blogs} />

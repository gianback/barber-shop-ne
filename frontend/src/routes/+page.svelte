<script>
	import About from '$lib/components/About.svelte';
	import Banner from '$lib/components/Banner.svelte';
	import Blogs from '$lib/components/Blogs.svelte';
	import Services from '$lib/components/Services.svelte';

	const { data } = $props();

	const { services, blogs } = data;
</script>

<Banner />
<About />
<Services {services} />
<Blogs {blogs} />

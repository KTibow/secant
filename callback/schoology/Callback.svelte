<script lang="ts">
  import { Icon } from 'm3-svelte';
  import { onward } from 'kreations';
  import exchange from './exchange.remote';
  import { save } from '../../src/resources/setup/save';
  import { SCHOOLOGY_REQUEST_AUTH_STORAGE } from '../../src/resources/setup/storage';
  import ErrorAlert from '../../src/lib/ErrorAlert.svelte';

  const run = async () => {
    const requestAuthStr = localStorage[SCHOOLOGY_REQUEST_AUTH_STORAGE];
    if (!requestAuthStr) throw new Error('No request auth found');
    delete localStorage[SCHOOLOGY_REQUEST_AUTH_STORAGE];

    const requestAuth = JSON.parse(requestAuthStr);
    const auth = await exchange(requestAuth);
    save(auth);
    location.href = location.origin;
  };
</script>

{#await run()}
  <Icon icon={onward} size={48} />
{:catch error}
  <ErrorAlert {error} />
{/await}

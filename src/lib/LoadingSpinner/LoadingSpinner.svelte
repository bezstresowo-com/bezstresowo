<script lang="ts">

  const { size = 'sm', color = 'border-primary', label = undefined, tailwind = undefined }: {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    label?: string;
    tailwind?: string;
  } = $props();

  const sizeClasses: Record<typeof size, string> = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-4'
  };
</script>

<div class={`inline-flex items-center gap-2 ${tailwind}`} role="status" aria-live="polite">
  <span
    class={`inline-block rounded-full border-solid border-transparent border-t-current animate-spin ${sizeClasses[size]} ${color}`}
  ></span>

  {#if label}
    <span class="text-sm text-primary">
      {label}
    </span>
  {/if}
</div>

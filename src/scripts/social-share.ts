const copyFallback = (value: string): boolean => {
  const input = document.createElement('textarea');
  input.value = value;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } finally {
    input.remove();
  }
  return copied;
};

document.querySelectorAll<HTMLElement>('[data-rizzoma-social-share]').forEach((section) => {
  const url = section.dataset.shareUrl;
  if (!url) return;

  const title = section.dataset.shareTitle || document.title;
  const text = section.dataset.shareText || '';
  const status = section.querySelector<HTMLElement>('[data-rz-share-feedback]');
  const copyButton = section.querySelector<HTMLButtonElement>('[data-rz-share-copy]');
  const nativeButton = section.querySelector<HTMLButtonElement>('[data-rz-share-native]');

  const showStatus = (message: string) => {
    if (status) status.textContent = message;
  };

  copyButton?.addEventListener('click', async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        showStatus('Enlace copiado. Ya puedes enviarlo.');
      } else if (copyFallback(url)) {
        showStatus('Enlace copiado. Ya puedes enviarlo.');
      } else {
        showStatus('Selecciona la dirección de esta página para copiarla.');
      }
    } catch {
      showStatus(copyFallback(url) ? 'Enlace copiado. Ya puedes enviarlo.' : 'Selecciona la dirección de esta página para copiarla.');
    }
  });

  if (navigator.share) {
    if (nativeButton) nativeButton.hidden = false;
    nativeButton?.addEventListener('click', async () => {
      try {
        await navigator.share({ title, text, url });
        showStatus('Se abrió el menú para compartir.');
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        showStatus('No se pudo abrir el menú. Usa una red social o copia el enlace.');
      }
    });
  }
});

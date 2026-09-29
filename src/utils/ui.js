export const mostrarToast = (mensaje, tipo = 'success') => {
    const toast = document.createElement('div');
    const bgColor = tipo === 'success' ? '#059669' : '#ef4444';
    
    toast.style.cssText = `
        position: fixed; top: 30px; right: 30px; background: ${bgColor}; 
        color: white; padding: 16px 24px; border-radius: 8px; 
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); z-index: 10000; 
        font-weight: bold; font-size: 0.95rem; transform: translateX(150%); 
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    toast.innerHTML = `${tipo === 'success' ? '✅' : '❌'} &nbsp; ${mensaje}`;
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => { toast.style.transform = 'translateX(0)'; }, 10);
    
    // Animar salida y remover
    setTimeout(() => { 
        toast.style.transform = 'translateX(150%)'; 
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};

export const mostrarConfirmacion = (mensaje, onConfirm) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); 
        display: flex; justify-content: center; align-items: center; z-index: 10000;
        opacity: 0; transition: opacity 0.2s;
    `;
    
    const box = document.createElement('div');
    box.style.cssText = `
        background: var(--surface); padding: 35px; border-radius: 16px; 
        border: 1px solid var(--border-color); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); 
        max-width: 400px; width: 90%; text-align: center; transform: scale(0.95); transition: transform 0.2s;
    `;
    
    box.innerHTML = `
        <h3 style="color: var(--text-color); margin-top: 0; font-size: 1.3rem;">⚠️ Confirmar Acción</h3>
        <p style="color: var(--text-muted); margin: 15px 0 25px 0; line-height: 1.5; font-size: 0.95rem;">${mensaje}</p>
        <div style="display: flex; justify-content: center; gap: 15px;">
            <button id="btn-cancel-conf" style="padding: 10px 20px; border: none; background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; font-weight: bold;">Cancelar</button>
            <button id="btn-ok-conf" style="padding: 10px 20px; border: none; background: #ef4444; color: white; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);">Confirmar</button>
        </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        box.style.transform = 'scale(1)';
    });

    const cerrar = () => {
        overlay.style.opacity = '0';
        box.style.transform = 'scale(0.95)';
        setTimeout(() => overlay.remove(), 200);
    };

    document.getElementById('btn-cancel-conf').onclick = cerrar;
    document.getElementById('btn-ok-conf').onclick = () => {
        onConfirm();
        cerrar();
    };
};
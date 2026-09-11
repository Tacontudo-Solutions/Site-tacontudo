/**
 * Loader "speeder" (foguetinho hyper-speed com rastros) — adaptação dark-mode
 * do bloco de referência pras cores da marca: corpo amarelo #FFC400 com glow,
 * rastros e linhas de velocidade em azul #478ac9 sobre o fundo Ink.
 * Todo o CSS fica em index.css (seção "Speeder loader"). Puramente decorativo;
 * o pai precisa ser posicionado (as linhas longas cobrem ele inteiro).
 */
export function SpeederLoader() {
  return (
    <>
      {/* Linhas longas de velocidade cruzando o fundo */}
      <div className="speeder-longfazers" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* Foguetinho */}
      <div className="speeder-stage" aria-hidden="true">
        <div className="speeder">
          <span>
            <span />
            <span />
            <span />
            <span />
          </span>
          <div className="speeder-base">
            <span />
            <div className="speeder-face" />
          </div>
        </div>
      </div>
    </>
  );
}

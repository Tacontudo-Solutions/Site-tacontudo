# Configuração do Google Analytics

## Como configurar o monitoramento

### 1. Google Analytics

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Crie uma nova propriedade para seu site
3. Obtenha o ID de rastreamento (formato: G-XXXXXXXXXX)
4. Edite o arquivo `assets/js/monitoring.js`
5. Substitua `'G-XXXXXXXXXX'` pelo seu ID real na linha:
   ```javascript
   gaTrackingId: 'SEU_ID_AQUI',
   ```

### 2. Funcionalidades Implementadas

#### Core Web Vitals
- **LCP (Largest Contentful Paint)**: Tempo para carregar o maior elemento
- **FID (First Input Delay)**: Tempo de resposta à primeira interação
- **CLS (Cumulative Layout Shift)**: Estabilidade visual da página
- **FCP (First Contentful Paint)**: Tempo para primeiro conteúdo
- **TTFB (Time to First Byte)**: Tempo de resposta do servidor

#### Logs de Erro
- Erros JavaScript automáticos
- Promises rejeitadas
- Falhas de carregamento de recursos
- Armazenamento local dos últimos 50 erros

#### Monitoramento de Performance
- Tempos de carregamento da página
- Métricas de rede (DNS, TCP, resposta do servidor)
- Tempos de renderização DOM
- Informações de navegação

#### Eventos Customizados
- Cliques em botões e links
- Tempo gasto na página
- Profundidade de scroll (25%, 50%, 75%, 100%)

### 3. Como Visualizar os Dados

#### No Console do Navegador
```javascript
// Obter dados de Web Vitals
Monitoring.getWebVitals()

// Obter dados de performance
Monitoring.getPerformanceData()

// Obter erros registrados
Monitoring.getErrors()

// Obter relatório completo
Monitoring.getReport()

// Rastrear evento customizado
Monitoring.trackEvent('custom_action', { detail: 'valor' })

// Limpar dados armazenados
Monitoring.clearData()
```

#### No Google Analytics
1. Acesse seu painel do Google Analytics
2. Vá para **Relatórios** > **Eventos**
3. Procure pelos eventos:
   - `web_vitals`: Métricas de Core Web Vitals
   - `exception`: Erros registrados
   - `timing_complete`: Tempos de carregamento
   - `click`: Cliques em elementos
   - `scroll_depth`: Profundidade de scroll
   - `time_on_page`: Tempo na página

### 4. Configurações Avançadas

No arquivo `monitoring.js`, você pode ajustar:

```javascript
const MONITORING_CONFIG = {
    // Seu ID do Google Analytics
    gaTrackingId: 'G-XXXXXXXXXX',
    
    // Configurações de Web Vitals
    webVitals: {
        enabled: true,
        reportThreshold: 100,
        sampleRate: 1.0 // 100% das sessões
    },
    
    // Configurações de logs de erro
    errorLogging: {
        enabled: true,
        maxErrors: 50,
        reportToConsole: true,
        reportToServer: false, // Configure se tiver endpoint
        serverEndpoint: '/api/errors'
    },
    
    // Configurações de performance
    performance: {
        enabled: true,
        trackUserTiming: true,
        trackResourceTiming: true
    }
};
```

### 5. Relatório de Servidor (Opcional)

Para enviar erros para seu servidor:

1. Configure `reportToServer: true`
2. Defina o `serverEndpoint`
3. Implemente um endpoint que receba POST com JSON:

```javascript
// Exemplo de estrutura do erro enviado
{
    "type": "javascript",
    "message": "Erro description",
    "filename": "script.js",
    "lineno": 123,
    "colno": 45,
    "stack": "Error stack trace",
    "timestamp": 1640995200000,
    "url": "https://seusite.com/pagina",
    "userAgent": "Mozilla/5.0..."
}
```

### 6. Métricas Importantes

#### Thresholds Recomendados (Core Web Vitals)
- **LCP**: < 2.5s (Bom), 2.5s-4s (Precisa melhorar), > 4s (Ruim)
- **FID**: < 100ms (Bom), 100ms-300ms (Precisa melhorar), > 300ms (Ruim)
- **CLS**: < 0.1 (Bom), 0.1-0.25 (Precisa melhorar), > 0.25 (Ruim)

#### Performance
- **TTFB**: < 200ms (Excelente), < 500ms (Bom), > 1s (Ruim)
- **FCP**: < 1.8s (Bom), 1.8s-3s (Precisa melhorar), > 3s (Ruim)

### 7. Troubleshooting

#### Se os dados não aparecem no Google Analytics:
1. Verifique se o ID de rastreamento está correto
2. Aguarde até 24h para os dados aparecerem
3. Verifique o console do navegador por erros
4. Teste em modo incógnito

#### Se os Web Vitals não são coletados:
1. Verifique se o navegador suporta PerformanceObserver
2. Teste em diferentes navegadores
3. Verifique se há bloqueadores de anúncios ativos

### 8. Privacidade e LGPD

O script respeita a privacidade:
- Não coleta dados pessoais identificáveis
- Armazena dados apenas localmente e no Google Analytics
- Você pode desabilitar qualquer funcionalidade nas configurações
- Para compliance total com LGPD, considere implementar um banner de cookies

### 9. Performance do Script

- Script otimizado para não impactar performance
- Carregamento assíncrono
- Debounce em eventos de scroll
- Limite de erros para evitar spam
- Armazenamento local limitado

---

**Nota**: Lembre-se de substituir `G-XXXXXXXXXX` pelo seu ID real do Google Analytics para ativar o monitoramento completo.
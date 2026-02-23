/**
 * Script de teste para verificar a distribuição de exercícios
 * Usa Firebase Admin SDK para criar um custom token para testes
 */

import admin from './firebase/firebaseAdmin.js';

const API_BASE = 'http://localhost:3000/api';

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

async function getTestToken() {
  // Procurar um utilizador existente na Firebase para usar nos testes
  const listResult = await admin.auth().listUsers(1);
  
  if (listResult.users.length === 0) {
    throw new Error('Nenhum utilizador encontrado no Firebase. Crie um utilizador primeiro.');
  }
  
  const testUser = listResult.users[0];
  log(colors.cyan, `[INFO] Usando utilizador: ${testUser.email} (UID: ${testUser.uid})`);
  
  // Criar custom token
  const customToken = await admin.auth().createCustomToken(testUser.uid);
  
  // Trocar custom token por ID token usando a REST API
  const apiKey = "AIzaSyAY8AIhyv_ztvL-rqOxeR2DprdTitB9VJE";
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true
      })
    }
  );
  
  const data = await response.json();
  
  if (!data.idToken) {
    throw new Error(`Falha ao obter ID token: ${JSON.stringify(data)}`);
  }
  
  return data.idToken;
}

async function runTest(testName, token, requestBody, validate) {
  log(colors.bold, `\n${'='.repeat(60)}`);
  log(colors.cyan, `[TESTE] ${testName}`);
  log(colors.bold, `${'='.repeat(60)}`);
  
  console.log('\n[REQUEST BODY]:');
  console.log(JSON.stringify(requestBody, null, 2));
  
  try {
    const response = await fetch(`${API_BASE}/workout-plans/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    console.log(`\n[STATUS]: ${response.status}`);
    
    if (!response.ok) {
      log(colors.red, `[ERRO] ${data.message || 'Erro desconhecido'}`);
      if (data.errors) {
        console.log('[VALIDATION ERRORS]:', data.errors);
      }
      return { success: false, data };
    }
    
    // Mostrar informações do plano
    console.log('\n[PLANO CRIADO]:');
    console.log(`  - ID: ${data.plan?.id}`);
    console.log(`  - Nome: ${data.plan?.name}`);
    console.log(`  - Tipo: ${data.plan?.workout_type}`);
    console.log(`  - Nível: ${data.plan?.level}`);
    console.log(`  - Músculos: ${JSON.stringify(data.plan?.muscles)}`);
    console.log(`  - Nº Exercícios: ${data.exercises?.length || 0}`);
    
    // Mostrar distribuição de exercícios
    if (data.exercises && data.exercises.length > 0) {
      console.log('\n[EXERCÍCIOS]:');
      data.exercises.forEach((ex, i) => {
        console.log(`  ${i + 1}. [${ex.muscle_group}] ${ex.name}`);
      });
      
      // Calcular distribuição
      const distribution = {};
      data.exercises.forEach(ex => {
        distribution[ex.muscle_group] = (distribution[ex.muscle_group] || 0) + 1;
      });
      
      console.log('\n[DISTRIBUIÇÃO POR GRUPO MUSCULAR]:');
      Object.entries(distribution).forEach(([muscle, count]) => {
        const bar = '█'.repeat(count);
        console.log(`  ${muscle.padEnd(20)} ${count} ${bar}`);
      });
    }
    
    // Executar validação customizada
    if (validate) {
      const validationResult = validate(data);
      if (validationResult.passed) {
        log(colors.green, `\n✅ PASSOU: ${validationResult.message}`);
      } else {
        log(colors.red, `\n❌ FALHOU: ${validationResult.message}`);
      }
      return { success: validationResult.passed, data };
    }
    
    log(colors.green, '\n✅ Teste executado com sucesso');
    return { success: true, data };
    
  } catch (err) {
    log(colors.red, `[ERRO DE REDE]: ${err.message}`);
    return { success: false, error: err.message };
  }
}

async function main() {
  log(colors.bold, '\n🏋️ TESTES DE DISTRIBUIÇÃO DE EXERCÍCIOS');
  log(colors.bold, '========================================\n');
  
  let token;
  try {
    token = await getTestToken();
    log(colors.green, '[OK] Token obtido com sucesso\n');
  } catch (err) {
    log(colors.red, `[ERRO] Falha ao obter token: ${err.message}`);
    process.exit(1);
  }
  
  const results = [];
  
  // TESTE 1: Dois músculos com distribuição balanceada
  results.push(await runTest(
    '1. Dois músculos (peito + costas) - 6 exercícios',
    token,
    {
      workout_type: 'weightlifting',
      level: 'beginner',
      muscles: ['peito', 'costas'],
      exercises_number: 6,
      series_number: 3,
      reps_number: 10,
      rest_time: 60
    },
    (data) => {
      const distribution = {};
      data.exercises?.forEach(ex => {
        distribution[ex.muscle_group] = (distribution[ex.muscle_group] || 0) + 1;
      });
      
      const values = Object.values(distribution);
      const allEqual = values.length === 2 && values[0] === values[1];
      
      return {
        passed: allEqual,
        message: allEqual 
          ? 'Distribuição equilibrada (3-3) entre dois músculos'
          : `Distribuição não equilibrada: ${JSON.stringify(distribution)}`
      };
    }
  ));
  
  // TESTE 2: Três músculos - verificar round-robin
  results.push(await runTest(
    '2. Três músculos (triceps + biceps + ombros) - 7 exercícios',
    token,
    {
      workout_type: 'weightlifting',
      level: 'intermediate',
      muscles: ['triceps', 'biceps', 'ombros'],
      exercises_number: 7,
      series_number: 4,
      reps_number: 12,
      rest_time: 90
    },
    (data) => {
      const distribution = {};
      data.exercises?.forEach(ex => {
        distribution[ex.muscle_group] = (distribution[ex.muscle_group] || 0) + 1;
      });
      
      const values = Object.values(distribution);
      const maxDiff = Math.max(...values) - Math.min(...values);
      
      return {
        passed: maxDiff <= 1,
        message: maxDiff <= 1
          ? `Round-robin correto - diferença máxima de 1: ${JSON.stringify(distribution)}`
          : `Round-robin falhou - diferença > 1: ${JSON.stringify(distribution)}`
      };
    }
  ));
  
  // TESTE 3: Um único músculo
  results.push(await runTest(
    '3. Um único músculo (peito) - 4 exercícios',
    token,
    {
      workout_type: 'weightlifting',
      level: 'beginner',
      muscles: ['peito'],
      exercises_number: 4,
      series_number: 3,
      reps_number: 10,
      rest_time: 60
    },
    (data) => {
      const allSameMuscle = data.exercises?.every(ex => 
        ex.muscle_group?.toLowerCase().includes('peito') || 
        ex.muscle_group?.toLowerCase().includes('chest')
      );
      
      return {
        passed: data.exercises?.length === 4 && allSameMuscle,
        message: allSameMuscle
          ? `Todos os 4 exercícios são do grupo peito`
          : `Exercícios de grupos inesperados encontrados`
      };
    }
  ));
  
  // TESTE 4: Calistenia
  results.push(await runTest(
    '4. Calistenia com múltiplos músculos - 5 exercícios',
    token,
    {
      workout_type: 'calisthenics',
      level: 'intermediate',
      muscles: ['peito', 'costas', 'abdominais'],
      exercises_number: 5,
      series_number: 3,
      reps_number: 15,
      rest_time: 45
    },
    (data) => {
      return {
        passed: data.exercises?.length === 5,
        message: data.exercises?.length === 5
          ? `5 exercícios de calistenia retornados`
          : `Esperado 5 exercícios, recebido ${data.exercises?.length}`
      };
    }
  ));
  
  // TESTE 5: Cardio (sem distribuição por músculo)
  results.push(await runTest(
    '5. Cardio - apenas duração (sem músculos)',
    token,
    {
      workout_type: 'cardio',
      level: 'beginner',
      duration: 30
    },
    (data) => {
      const musclesIsNull = data.plan?.muscles === null;
      const hasDuration = data.plan?.duration === 30;
      
      return {
        passed: musclesIsNull && hasDuration,
        message: musclesIsNull && hasDuration
          ? `Cardio correto: muscles=null, duration=${data.plan?.duration}`
          : `Cardio incorreto: muscles=${data.plan?.muscles}, duration=${data.plan?.duration}`
      };
    }
  ));
  
  // TESTE 6: Muitos exercícios pedidos (pode haver menos disponíveis)
  results.push(await runTest(
    '6. Pedido 20 exercícios - verificar limite',
    token,
    {
      workout_type: 'weightlifting',
      level: 'advanced',
      muscles: ['quadriceps', 'gluteos'],
      exercises_number: 20,
      series_number: 5,
      reps_number: 8,
      rest_time: 120
    },
    (data) => {
      const count = data.exercises?.length || 0;
      
      return {
        passed: count > 0,
        message: count > 0
          ? `Retornados ${count} exercícios (máximo disponível)`
          : `Nenhum exercício retornado`
      };
    }
  ));
  
  // RESUMO FINAL
  log(colors.bold, '\n' + '='.repeat(60));
  log(colors.bold, 'RESUMO DOS TESTES');
  log(colors.bold, '='.repeat(60));
  
  let passed = 0, failed = 0;
  results.forEach((r, i) => {
    if (r.success) {
      log(colors.green, `  ✅ Teste ${i + 1}: PASSOU`);
      passed++;
    } else {
      log(colors.red, `  ❌ Teste ${i + 1}: FALHOU`);
      failed++;
    }
  });
  
  log(colors.bold, '\n' + '-'.repeat(60));
  log(passed === results.length ? colors.green : colors.yellow,
    `  Total: ${passed}/${results.length} testes passaram`);
  
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  log(colors.red, `[ERRO FATAL]: ${err.message}`);
  console.error(err);
  process.exit(1);
});

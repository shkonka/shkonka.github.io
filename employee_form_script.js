document.addEventListener('DOMContentLoaded', function () {
    const recommendations = document.getElementById('recommendations');
    const recommendationsList = document.getElementById('recommendation-list');
    const block1Result = document.getElementById('block1-result');
    const block2Result = document.getElementById('block2-result');
    const block3Result = document.getElementById('block3-result');
    const block4Result = document.getElementById('block4-result');
    const block5Result = document.getElementById('block5-result');

    // Обработка кастомных выпадающих списков
    document.querySelectorAll('.custom-select').forEach(select => {
        const trigger = select.querySelector('.custom-select-trigger');
        const options = select.querySelectorAll('.custom-option');

        // Открытие и закрытие списка
        trigger.addEventListener('click', function () {
            closeAllSelects();
            select.classList.toggle('open');
        });

        // Выбор элемента
        options.forEach(option => {
            option.addEventListener('click', function () {
                trigger.textContent = this.textContent;
                trigger.dataset.value = this.dataset.value;

                // Устанавливаем выбранное значение
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                select.classList.remove('open');
            });
        });
    });

    // Закрытие всех списков при клике вне
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.custom-select')) closeAllSelects();
    });

    function closeAllSelects() {
        document.querySelectorAll('.custom-select.open').forEach(select => select.classList.remove('open'));
    }

    // Обработка отправки формы
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        recommendationsList.innerHTML = ''; // Очищаем предыдущие рекомендации
        recommendations.style.display = 'none'; // Скрываем рекомендации до успешной обработки

        try {
            // Валидация выбранных значений
            document.querySelectorAll('.custom-select-trigger').forEach(trigger => {
                console.log(`ID: ${trigger.parentElement.dataset.id}, Value: ${trigger.dataset.value}`);
                if (!trigger.dataset.value || trigger.dataset.value.trim() === '') {
                    throw new Error(`Вы не выбрали ответ для вопроса с ID: ${trigger.parentElement.dataset.id}`);
                }
            });            

            // Подсчёт баллов для всех блоков и генерация рекомендаций
            const allRecommendations = [];
            const block1Sum = getBlockSum(form, [
                {
                    id: 'strategy',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Сразу же сформировать стратегию компании бывает непросто. Рекомендуем начать с формирования бизнес-цели на ближайший финансовый год. Шаблон доступен по ссылке.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'task_setting',
                    validAnswers: ['звоню', 'ставлю на совещании/личной встрече', 'пишу в мессенджере', 'есть специальное ПО', 'никак'],
                    recommendation: `Уверены, что задачи вы все-таки ставите, но, возможно, делаете это не системно и с использованием нескольких информационных каналов. Необходимо определиться с каналом информирования сотрудников и помимо формулировки самой задачи, использовать еще несколько критериев, в т.ч. сроки, ответственного, результат. Подробнее см. по ссылке. Использование специальных информационных продуктов позволяет не только быстро доносить новую задачу до подчиненных, но и контролировать ее исполнение.`,
                    scoreMap: { 'звоню': 1, 'ставлю на совещании/личной встрече': 1, 'пишу в мессенджере': 1, 'есть специальное ПО': 1, 'никак': 0 }
                },
                {
                    id: 'overdue',
                    validAnswers: ['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
                    recommendation: `Работа с просроченными задачами занимает очень значительную часть операционной деятельности любого руководителя. Чтобы снизить это время необходимо не только четко ставить задачу, но и указывать ее сроки и результат, который вы хотите достичь, а также регулярно проводить контрольные мероприятия. Легче всего это осуществлять в программном продукте.`,
                    scoreMap: (val) => parseInt(val, 10) >= 50 ? 1 : 0
                },
                {
                    id: 'meeting_protocol',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Проведение совещания без протокола снижает эффективность данного мероприятия в несколько раз. Вести протокол совсем несложно. Для этого есть специальные шаблоны и несколько простых правил.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'protocol_to_task',
                    validAnswers: ['секретарь рассылает в протокол', 'сразу на совещании заносим в автоматизированный задачник', 'рассылаем по электронной почте', 'сотрудники сами записывают на совещании', 'никак'],
                    recommendation: `Пункты протокола должны превращаться в задачи для ваших подчиненных оперативно и по возможности без вашего активного участия. Сделать это можно несколькими путями: 1) назначьте секретаря совещания и он (а), распределить задачи после совещания в ручном режиме; 2) работайте в информационном продукте и сразу же на совещании фиксируйте задачи.`,
                    scoreMap: { 'секретарь рассылает в протокол': 1, 'сразу на совещании заносим в автоматизированный задачник': 1, 'рассылаем по электронной почте': 1, 'сотрудники сами записывают на совещании': 1, 'никак': 0 }
                }
            ], allRecommendations);

            // Логика блока 2
            const block2Sum = getBlockSum(form, [
                {
                    id: 'job_portrait',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Портрет должности помогает более эффективно и оперативно осуществлять поиск сотрудников в случае открытия новых вакансий или их увольнения. Рекомендуем составить портреты ключевых должностей с использованием шаблона.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'instructions',
                    validAnswers: ['да', 'нет'],
                    recommendation: `"Лучший" способ составить должностную инструкцию - это скачать ее из Сети. Настоятельно не рекомендуем так поступать. Должностная инструкция должна быть подготовлена под конкретную должность на конкретном предприятии на конкретном этапе. Рекомендуем применять принцип "3+20" и использовать предлагаемый шаблон.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'full_efficiency',
                    validAnswers: ['менее 1 месяца', 'через месяц', 'через 2 месяца', 'более трех месяцев'],
                    recommendation: `Очень часто вновь нанятый сотрудник не сразу начинает приносить прибыль компании, т.е. выполнять свои должностные инструкции на 100%. Рекомендуем сократить период адаптации сотрудника до 1-2 месяцев. Один из лучших способов сокращения периода - это система наставничества, которая подразумевает составление адаптационного плана для каждого вновь приятого сотрудника. Заполните, пожалуйста, шаблоны по всем ключевым позициям.`,
                    scoreMap: { 'менее 1 месяца': 1, 'через месяц': 1, 'через 2 месяца': 1, 'более трех месяцев': 0 }
                },
                {
                    id: 'mentorship',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Система наставничества - важнейший элемент адаптации нового сотрудника. Помимо адаптационного плана (см. шаблоны), она подразумевает наставника из числа опытных сотрудников. Наставник, используя адаптационный план, сопровождает новичка в течение 1-2 месяцев. Как и всякая работа, труд наставника должен быть оплачен. Рекомендуем учесть данный факт в вашем Положении об оплате труда.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'training',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Система обучения сотрудников - важнейший элемент не только адаптации нового сотрудника, но и стимулирования действующих работников предприятия, а также важный инструмент повышения производительности труда. Рекомендуем составить концепцию и план обучения сотрудников, используя шаблон.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                }
            ], allRecommendations);

            // Логика блока 3
            const block3Sum = getBlockSum(form, [
                {
                    id: 'payment',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Рекомендуем составить положение об оплате труда, используя прилагаемый шаблон. Данный документ не только основа системы стимулирования вашего сотрудника, но и требование трудового законодательства многих стран мира, в т.ч. Российской Федерации.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'stimulation_methods',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Оплата труда - это далеко не единственный способ стимулирования ваших сотрудников. Помимо материальных стимулов существует множество нематериальных. Рекомендуем составить проект системы стимулирования вашей компании, используя шаблон.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'visual_stimulation',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Положение об оплате труда и система стимулирования, действующая на предприятии, должны быть доступны каждому сотруднику компании. Рекомендуем визуализировать их, обсудить проекты данных документов с коллективом и разместить их на корпоративном портале.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'corporate_culture',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Корпоративная культура компании может стать полноценным активом любого предприятия. Рекомендуем визуализировать основные элементы вашей корпоративной культуры, используя прилагаемый шаблон.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'roles',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Четкое представление сотрудником своих должностных обязанностей, бизнес-цели и перспектив карьерного роста - это важные элементы системы стимулирования. Рекомендуем визуализировать данные элементы и ознакомить с ними ваших сотрудников.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                }
            ], allRecommendations);

            // Логика блока 4
            const block4Sum = getBlockSum(form, [
                {
                    id: 'business_processes',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Описание бизнес-процессов необходимо, особенно если над одной задачей трудятся несколько человек. Рекомендуем начать работать с этим разделом, используя шаблон.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'responsible_employee',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Если у вас нет отдельного сотрудника, отвечающего за описание бизнес-процессов, распределите функционал среди топ-менеджеров компании.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'software_use',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Описать бизнес-процессы можно текстом, таблицей, но лучше использовать схемы и язык UML. Подробнее про UML читайте по ссылке.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'regulations',
                    validAnswers: ['да', 'нет'],
                    recommendation: `UML помогает создавать универсальные графические представления сложных процессов. Подробнее читайте по ссылке.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'quality_control',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Описанные бизнес-процессы формируют систему регламентов. Рекомендуем начать с перечня регламентов вашей организации.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                }
            ], allRecommendations);

            // Логика блока 5
            const block5Sum = getBlockSum(form, [
                {
                    id: 'org_structure',
                    validAnswers: ['линейно-функциональная', 'дивизиональная', 'матричная', 'проектная', 'другая', 'затрудняюсь ответить'],
                    recommendation: `Рекомендуем выбрать подходящий тип организационной структуры и визуализировать ее.`,
                    scoreMap: { 'линейно-функциональная': 1, 'дивизиональная': 1, 'матричная': 1, 'проектная': 1, 'другая': 1, 'затрудняюсь ответить': 0 }
                },
                {
                    id: 'structure_visual',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Рекомендуем определиться с типом организационной структуры, визуализировать ее и проинформировать сотрудников.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'hierarchy',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Рекомендуем визуализировать вашу организационную структуру и проинформировать сотрудников.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'roles_knowledge',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Рекомендуем отразить систему подчиненности в вашей схеме и ознакомить коллектив с данной информацией.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                },
                {
                    id: 'cross_tasks',
                    validAnswers: ['да', 'нет'],
                    recommendation: `Рекомендуем отразить взаимодействия сотрудников в организационной структуре компании.`,
                    scoreMap: { 'да': 1, 'нет': 0 }
                }
            ], allRecommendations);

            // Отображение результатов
            block1Result.textContent = `Блок 1 (Задачи): ${block1Sum}`;
            block2Result.textContent = `Блок 2 (Люди): ${block2Sum}`;
            block3Result.textContent = `Блок 3 (Система стимулирования): ${block3Sum}`;
            block4Result.textContent = `Блок 4 (Бизнес-процессы): ${block4Sum}`;
            block5Result.textContent = `Блок 5 (Организационная структура): ${block5Sum}`;
            recommendations.style.display = 'block';

            // Добавление рекомендаций в список
            allRecommendations.forEach(rec => {
                const li = document.createElement('li');
                li.textContent = rec;
                recommendationsList.appendChild(li);
            });

            // Построение диаграммы
            drawRadarChart([block1Sum, block2Sum, block3Sum, block4Sum, block5Sum]);
        } catch (error) {
            console.error('Ошибка обработки формы:', error.message);
            alert('Пожалуйста, исправьте ошибки в ответах и попробуйте снова.');
        }
    });

    // Функция подсчёта баллов и сбора рекомендаций для блока
    function calculateBlockScore(questions, recommendations) {
        return questions.reduce((sum, { id, validAnswers, scoreMap, recommendation }) => {
            const trigger = document.querySelector(`.custom-select[data-id="${id}"] .custom-select-trigger`);
            const value = trigger.dataset.value || '';
            if (!validAnswers.includes(value)) throw new Error(`Некорректный ответ для вопроса с ID: ${id}`);
            if (scoreMap[value] === 0 && recommendation) recommendations.push(recommendation);
            return sum + (scoreMap[value] || 0);
        }, 0);
    }

    // Функция для построения диаграммы
    function drawRadarChart(data) {
        const ctx = document.getElementById('radarChart').getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Блок 1', 'Блок 2', 'Блок 3', 'Блок 4', 'Блок 5'],
                datasets: [{
                    label: 'Оценка',
                    data,
                    backgroundColor: 'rgba(136, 190, 255, 0.2)',
                    borderColor: 'rgba(136, 190, 255, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5
                    }
                }
            }
        });
    }
});

const settings = { // Вспомогательный объект
    switchButton: document.querySelector('.switch'), // DOM узел кнопки смены выбора игрока (крестик или нолик)
    startButton: document.querySelector('.start'), // DOM узел кнопки старта игры
    allCells: Array.from( document.querySelectorAll('.box') ), // Массив из всех ячеек
    computer: document.querySelector('.computer .type'), // Dom узел, который показывает выбор компьютера
    player: document.querySelector('.gamer .type'), // Dom узел, который показывает выбор игрока
    disable( elem, bool = true ) { elem.disabled = bool }, // Блокирует или разблокировывает переданный элемент. По умолчанию true
    disableAllCells( bool = true ) { this.allCells.forEach( i => i.disabled = bool ) }, // Блокирует или разблокировывает все ячейки. По умолчанию true
    switch() { // Метод, меняющий выборы компьютера и игрока
        ( [ this.computer.textContent, this.player.textContent ] = [ this.player.textContent, this.computer.textContent ] );
    }
}

const check = { // Объект, связанный с проверкой на победителя
    length(arr) { return arr.length > 0 }, // Проверяет длину массива
    rule(rule, nums) {  return rule.every(n => nums.includes(n)) && rule }, // Если в массива nums присутствует каждый элемент массива rule, возвращает массив rule. В ином случае false
    diagonals(nums) { // Проверяет массив nums по диагоналям. Если хоть одно условие true, возвращает массив индексов диагонали (элемент переменной diagonal)
        this.length(nums);
        const diagonal = [ [0, 4, 8], [2, 4, 6] ]
        return this.rule(diagonal[0], nums) 
            || this.rule(diagonal[1], nums)
    },
    rows(nums) { // Проверяет массив nums по горизонтали. Если хоть одно условие true, возвращает массив индексов диагонали (элемент переменной rows)
        this.length(nums);
        const rows = [ [0, 1, 2], [3, 4, 5], [6, 7, 8] ]
        return this.rule(rows[0], nums) 
            || this.rule(rows[1], nums) 
            || this.rule(rows[2], nums)
    },
    columns(nums) { // Проверяет массив nums по вертикали. Если хоть одно условие true, возвращает массив индексов диагонали (элемент переменной columns)
        this.length(nums);
        const columns = [ [0, 3, 6], [1, 4, 7], [2, 5, 8] ]
        return this.rule(columns[0], nums) 
            || this.rule(columns[1], nums) 
            || this.rule(columns[2], nums)
    }
}

const game = { // Объект, связанный с процессом игры
    playground: [ '', '', '', '', '', '', '', '', '' ], // Отражение ситуации на поле игры
    getIndexesOfType(type) { // Функция, возвращающая индексы 'x' или 'o' в game.playground в виде массива. По ним можно будет проверить на победную комбинацию
       if (type !== 'x' && type !== 'o') return 'error';
       return this.playground.map( (item, index) => item === type ? index : item ).filter( item => typeof item === 'number' )
    },
    player: '', // Выбор игрока. Значение присваивается после старта игры.
    computer: '', // Выбор компьютера. Значение присваивается после старта игры.
    highlightLine(arr) { // Функция, выделяющая победную комбинацию
        arr.forEach(n => settings.allCells[n].classList.add('winning-box'))
    },
    playerMove(item, arr) { // Добавляет ячейке необходимый класс, изменяет game.playground и блокирует эту ячейку, чтобы нельзя было нажать на нее далее
        item.classList.add(`${this.player}`)
        const index = arr.indexOf(item)
        this.playground[index] = this.player;
        item.disabled = true
    },
    computerMove(arr) { // Добавляет рандомной свободной ячейке необходимый класс, изменяет game.playground и блокирует эту ячейку, чтобы нельзя было нажать на нее далее
        const emptyBoxes = arr.map( (item, index) => item.disabled === true ? item : index ).filter( item => typeof item === 'number' )
        const randomIndex = emptyBoxes[ Math.floor( Math.random() * emptyBoxes.length ) ]
        arr[randomIndex].classList.add(`${this.computer}`)
        arr[randomIndex].disabled = true
        this.playground[randomIndex] = this.computer
    },
    checkWinner(str) { // Проверка ячеек игрока или компьютера на победную комбинацию. Возвращает true или false
        if (str !== 'player' && str !== 'computer') return 'error';
        let gamer = str === 'player' ? this.player : this.computer;
        const gamerBoxes = this.getIndexesOfType(gamer);
        const result = check.diagonals(gamerBoxes)
                    || check.rows(gamerBoxes)
                    || check.columns(gamerBoxes);
        if (result) {
            this.highlightLine(result)
            return true
        } else return false
    },
}

settings.switchButton.addEventListener('click', () => settings.switch())

settings.startButton.addEventListener('click', () => {
    settings.disable(settings.switchButton); // Блокирует кнопку смены выбора
    settings.disable(settings.startButton); // Блокирует кнопку старта
    settings.startButton.textContent = 'Playing'; 
    game.player = settings.player.textContent // Присваиваем значение выбору игрока
    game.computer = settings.computer.textContent // Присваиваем значение выбору компьютера
    settings.allCells.forEach(item => {
        item.addEventListener('click', () => {
                game.playerMove(item, settings.allCells) // Ход игрока
                if (game.checkWinner('player')) { settings.disableAllCells() } // Проверка ячеек игрока 
                else { //Если у игрока нет победной комбинации выполняется ход компьютера
                    setTimeout( () => {
                        game.computerMove(settings.allCells) // Ход компьютера
                        if (game.checkWinner('computer')) { settings.disableAllCells() } // Проверка ячеек компьютера
                    }, 500 ) // Ход игрока высвечивается через 0,5 секунд после хода игрока
                }
        })
    })
})



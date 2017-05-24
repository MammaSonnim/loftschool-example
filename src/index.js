function drag() {
    /** @type {HTMLElement} */
    var block = document.createElement('div');

    block.style.width = "50px";
    block.style.height = "50px";
    block.style.background = "orange";
    block.style.position = "absolute";
    document.body.appendChild(block);

    /** @type {Object} */
    var startPoint;

    /** @type {boolean} */
    var isDragging = false;

    /** @param {MouseEvent} event */
    var blockMousedownHandler = function(event) {
        event.preventDefault();
        addEventListeners(event);
    };

    /** @param {MouseEvent} event */
    var documentMousemoveHandler = function(event) {
        event.preventDefault();
        setPosition(event, block);
    };

    /** @param {MouseEvent} event */
    var documentMouseupHandler = function(event) {
        removeEventListeners();
    };

    block.addEventListener('mousedown', blockMousedownHandler);

    /**
     * Навешиваются обработчики на движение и отпускание клавиши мыши
     * @param {MouseEvent} event
     */
    function addEventListeners(event) {
        if (isDragging) {
            removeEventListeners();
        }

        isDragging = true;

        startPoint = {
            x: event.clientX,
            y: event.clientY
        };

        document.addEventListener('mousemove', documentMousemoveHandler);
        document.addEventListener('mouseup', documentMouseupHandler);
    }

    /**
     * Рассчет позиции элемента при движении мыши
     * @param {MouseEvent} event
     * @param {HTMLElement} target
     */
    function setPosition(event, target) {
        var shift = {
            x: startPoint.x - event.clientX,
            y: startPoint.y - event.clientY
        };

        target.style.top = (target.offsetTop - shift.y) + 'px';
        target.style.left = (target.offsetLeft - shift.x) + 'px';

        startPoint = {
            x: event.clientX,
            y: event.clientY
        };
    }

    /** Снимаются обработчики на движение и отпускание клавиши мыши */
    function removeEventListeners() {
        document.removeEventListener('mousemove', documentMousemoveHandler);
        document.removeEventListener('mouseup', documentMouseupHandler);

        isDragging = false;
    }
}

drag();

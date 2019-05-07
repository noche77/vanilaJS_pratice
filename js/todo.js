//selector
const toDoForm = document.querySelector('.js-toDoForm'), //form
    toDoInput = toDoForm.querySelector('input'), //form>input
    toDoList = document.querySelector('.js-toDoList'); //form+ul

const TODOS_LS = 'toDos';

//array 그릇 만들어 놓기
let toDos = []; //const에서 let으로 바꿔줌

//li를 로컬스토리지에서까지 지우는 동작
function deleteToDo(event){
    const btn = event.target; //이벤트가 일어난 타겟
    const li = btn.parentNode; //그 타겟의 부모요소
    toDoList.removeChild(li); //form+ul의 자식요소 중에서 이벤트 일어난 li를 삭제
    const cleanToDos = toDos.filter(function(toDo) { //filter 메소드는 배열 안에서 루프를 돌며 각 객체마다 함수를 실행시킴
        return toDo.id !== parseInt(li.id); //toDo.id는 number, li.id는 string으로 잡히기 때문에 parseInt를 써서 숫자열로 바꿔줌
    }); 
    /*toDos 배열에서 루프를 돌며 함수를 실행시켜
    지금 선택한 li의 id와 일치하는 것을 제외한 나머지 객체들만 걸러서
    다시 배열을 만든 것을 cleanToDos에 저장
    */
    toDos = cleanToDos; //toDos를 cleanToDos로 갱신 
    // (cf) 이때 toDos에 대입하기 위해서 const toDos를 let toDos로 바꿔줘야함
    saveToDos(); //cleanToDos로 갱신된 toDos 배열을 로컬스토리지에서 갱신
}

//로컬스토리지에 toDos 배열을 저장하는 동작
function saveToDos(){
    localStorage.setItem(TODOS_LS, JSON.stringify(toDos)); //로컬스토리지에 key 값을 'toDos'로 하고 value를 toDos 배열로 하는 item 저장
    //로컬스토리지에는 javascript 데이터를 저장 할 수 없음
    //JSON.stringify는 javascript object를 string(문자열)로 바꿔줌
}

//todolist 추가하는 동작
function paintToDo(text){
    const li = document.createElement('li'); //li 요소를 만들고 li에 저장
    const delBtn = document.createElement('button'); //button 요소를 만들고 delBtn에 저장
    const span = document.createElement('span'); //span 요소를 만들고 span에 저장
    const newId = toDos.length + 1; //배열 toDos의 개수에 1을 더한 값을 newId에 저장
    delBtn.innerText = '❌'; //delBtn안에 X 텍스트 넣기
    delBtn.addEventListener('click', deleteToDo); //deleteToDo를 넣을때는 () 쓰지 않기
    span.innerText = text; //span안에 파라미터값 텍스트로 넣기
    li.appendChild(delBtn); //li에 delBtn을 자식요소로 넣기
    li.appendChild(span); //li에 span을 자식요소로 넣기
    li.id = newId; //li의 id에 newId(배열 toDos의 개수에 1을 더한 값) 넣기
    toDoList.appendChild(li); //form+ul에 li를 자식요소로 넣기
    const toDoObj = {
        text: text,  //key에 있는 text는 그대로 출력되고, value에 있는 text는 파라미터
        id: newId //세미콜론 넣으면 안됨
    }; //입력되는 텍스트 내용, id 값을 배열에 객체로 집어넣을 예정
    toDos.push(toDoObj); //toDos 배열에 객체 toDoObj 넣기
    saveToDos();
}

//input 조작하는 동작
function handleSubmit(event){
    event.preventDefault(); //input 창에서 엔터치면(submit) 새로고침되는 원래 기본 설정을 없애줌
    const currentValue = toDoInput.value; //currentValue에 input 창에 입력되는 값(value)를 저장
    paintToDo(currentValue); //text 파라미터에 input에서 입력된 값을 대입해 paintToDo 함수 실행
    toDoInput.value = ""; //input 창 안에 있는 내용 초기화
}

//
function loadToDos(){
    const loadedToDos = localStorage.getItem(TODOS_LS); //로컬스토리지에 있는 TODOS_LS값 가져오기
    if(loadedToDos !== null){
        const parsedToDos = JSON.parse(loadedToDos);
        parsedToDos.forEach(function(toDo){
            paintToDo(toDo.text); //이때 toDo는 파라미터(potato로 바꿔도 실행됨)
        });
    }
}

//
function init() {
    loadToDos();
    toDoForm.addEventListener('submit', handleSubmit); //form은 submit 이벤트 발생시 handleSubmit 함수 실행
}

init();
pragma solidity 0.8.23;

import "forge-std/Test.sol";
import {Pool} from "../src/Pool.sol";

contract PoolTest is Test{
    address owner = makeAddr("User0");
    address addr1 = makeAddr("User1");
    address addr2 = makeAddr("User2");
    address addr3 = makeAddr("User3");

    uint256 duration = 4 weeks; //conversion auto en seconde
    uint256 goal = 10 ether;

    Pool pool;

    function setUp() public{
        vm.prank(owner); // prochaine action faite uniquement par owner
        pool = new Pool(duration, goal);
    }

    function test_ContactDeployedSuccesfully() public{
        address _owner = pool.owner();
        assertEq(owner, _owner);    //test si deployment correct

        uint256 _end = pool.end();
        assertEq(block.timestamp + duration, _end);

        uint256 _goal= pool.goal();
        assertEq(goal, _goal);
    }

    //test contribute

    function test_RevertWhenAndIsReached () public{
        vm.warp(pool.end() +3600); //avance le temps

        bytes4 selector = bytes4(keccak256("CollectIsFinished()")); //recupere le message erreur
        vm.expectRevert(abi.encodeWithSelector(selector)); //test si bonne erreur

        vm.prank(addr1); //choix perso
        vm.deal(addr1, 1 ether); //de base 0 on lui en donne
        pool.contribute{value: 1 ether}();
    }

    function test_RevertWhenNotEnoughtFound() public{
        bytes4 selector = bytes4(keccak256("NotEnoughFunds()")); //recupere le message erreur
        vm.expectRevert(abi.encodeWithSelector(selector)); //test si bonne erreur
        vm.prank(addr1);
        pool.contribute();
    }

    function test_ExpectEmitSuccessContribute(uint96 _amount) public{   //_amout prend valeur aleatoire
        vm.assume(_amount > 0); //tout sauf 0
        vm.expectEmit(true,false, false, true); //lie a event -> indexed
        emit Pool.Contribute(address(addr1), _amount);

        vm.prank(addr1);
        vm.deal(addr1, _amount); 
        pool.contribute{value: _amount}();
    }

    //withdraw
    function test_RevertWhen_NotOwner() public{
        bytes4 selector = bytes4(keccak256("OwnableUnauthorizedAccount(address)")); //recupere le message erreur de owner
        vm.expectRevert(abi.encodeWithSelector(selector, addr1)); //test si bonne erreur
        vm.prank(addr1);
        pool.withdraw();
    }

    function test_RevertWhen_ItsNotReched() public{
        bytes4 selector = bytes4(keccak256("CollectNotFinished()")); //recupere le message erreur
        vm.expectRevert(abi.encodeWithSelector(selector)); //test si bonne erreur

        vm.prank(owner);//test si temps fini la non car juste creer donc pas withdraw
        pool.withdraw();
    }

    function test_RevertNot_EnoughFound() public{
        vm.prank(addr1);
        vm.deal(addr1, 5 ether);
        pool.contribute{value: 5 ether}();
        vm.warp(pool.end()+ 3600);

        bytes4 selector = bytes4(keccak256("CollectNotFinished()")); //recupere le message erreur
        vm.expectRevert(abi.encodeWithSelector(selector)); //test si bonne erreur   
        vm.prank(owner);
        pool.withdraw();
    }

    function test_FailedToWidrawEther() public{//test si pas de wallet permettant withdraw
        pool= new Pool(duration, goal);
        vm.prank(addr1);
        vm.deal(addr1, 11 ether);
        pool.contribute{value: 11 ether}();
        vm.warp(pool.end()+3600);

        bytes4 selector = bytes4(keccak256("FailedToSendEther()")); //recupere le message erreur
        vm.expectRevert(abi.encodeWithSelector(selector)); //test si bonne erreur 
        pool.withdraw();  
    }

    function test_Withdraw()public{
        vm.prank(addr1);
        vm.deal(addr1, 11 ether);
        pool.contribute{value: 11 ether}();
        vm.warp(pool.end()+3600);

        vm.prank(owner);
        pool.withdraw();
    }

    //refund

    function test_RevertWhen_NotFinished()public{
        vm.prank(addr1);
        vm.deal(addr1, 11 ether);
        pool.contribute{value: 11 ether}();
        bytes4 selector = bytes4(keccak256("CollectNotFinished()")); //recupere le message erreur
        vm.expectRevert(abi.encodeWithSelector(selector)); //test si bonne erreur 
        pool.refund();
    }

    function test_RevertWhenGoalAlreadyReach()public{
        vm.prank(addr1);
        vm.deal(addr1, 11 ether);
        pool.contribute{value: 11 ether}();
        vm.warp(pool.end()+3600);
        bytes4 selector = bytes4(keccak256("GoalAlreadyReached()")); //recupere le message erreur
        vm.expectRevert(abi.encodeWithSelector(selector)); //test si bonne erreur 

        pool.refund();
    }

    function test_Revert_WhenNO_Contribution() public{
        vm.prank(addr1);
        vm.deal(addr1, 5 ether);
        pool.contribute{value: 5 ether}();
        vm.prank(addr2);
        vm.warp(pool.end()+3600);
        bytes4 selector = bytes4(keccak256("NoContribution()")); //recupere le message erreur
        vm.expectRevert(abi.encodeWithSelector(selector)); //test si bonne erreur 

        pool.refund();
    }

    function test_RevertWhen_RefundFailed() public{
        vm.deal(address(this), 2 ether);
        pool.contribute{value: 2 ether}();
        vm.warp(pool.end()+3600);
        bytes4 selector = bytes4(keccak256("FailedToSendEther()")); //recupere le message erreur
        vm.expectRevert(abi.encodeWithSelector(selector)); //test si bonne erreur 

        pool.refund();
    }

    function test_Refund() public{
        vm.prank(addr1);
        vm.deal(addr1, 5 ether);
        pool.contribute{value: 5 ether}();
        vm.warp(pool.end()+3600);

        uint256 balanceBeforeRefund= addr1.balance;
        vm.prank(addr1);
        pool.refund();
        uint256 balanceAfterRefund = addr1.balance;

        assertEq(balanceBeforeRefund+5 ether, balanceAfterRefund);

    }

}
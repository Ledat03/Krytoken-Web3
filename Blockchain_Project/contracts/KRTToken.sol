// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./IERC20.sol";
contract KRTToken is IERC20 {
    uint256 private supply;
    mapping(address => uint256) private _Balances;
    mapping(address => mapping(address => uint256)) private Allowance;
    constructor(){
        supply = 1000000;
        _Balances[msg.sender] = supply;
    }
    function totalSupply() public override view returns (uint256){
        return supply;
    }
    function balanceOf(address _owner) public override view returns (uint256 balance){
        return _Balances[_owner];
    }
    function transfer(address _to, uint256 _value) public override returns (bool success){
        require(_Balances[msg.sender] >= _value,"Insufficient Amount");
        _Balances[msg.sender] -= _value;
        _Balances[_to] += _value;
        emit Transfer(msg.sender,_to,_value);
        return true;
    }
    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool success){
        require(_Balances[_from] >= _value,"Insufficient Amount !!");
        require(Allowance[_from][msg.sender] >= _value,"Can't send token !!");
        _Balances[_from] -= _value;
        _Balances[_to] += _value;
        emit Transfer(_from,_to,_value);
        return true;
    }
    function approve(address _spender, uint256 _value) public override returns (bool success){
        Allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    function allowance(address _owner, address _spender) public override view returns (uint256 value){
        return Allowance[_owner][_spender];
    }
}

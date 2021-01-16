/*
    Copyright 2020 VTD team, based on the works of Dynamic Dollar Devs and Empty Set Squad

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

pragma solidity ^0.5.17;
pragma experimental ABIEncoderV2;

import "../external/Decimal.sol";
import "../token/Dollar.sol";

import "../oracle/Oracle.sol";

import "../oracle/Pool.sol";
import "./Upgradeable.sol";
import "./Permission.sol";


contract Deployer1 is State, Permission, Upgradeable {
    function initialize() initializer public {
        _state.provider.dollar = new Dollar();
    }

    function implement(address implementation) external {
        upgradeTo(implementation);
    }
}

contract Deployer2 is State, Permission, Upgradeable {
    function initialize() initializer public {
    }

    function implement(address implementation) external {
        upgradeTo(implementation);
    }
}

contract Deployer3 is State, Permission, Upgradeable {
    function initialize() initializer public {
   }

// address dsdp, address usdtp, address ethp, address wbtcp
    function implement(address implementation) external {
        upgradeTo(implementation);
    }
}
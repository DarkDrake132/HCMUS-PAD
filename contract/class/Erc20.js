const contract = require("@truffle/contract")
const DeployJs = require("../builds/ERC20.json")

class Erc20 {
    #web3
    #handler

    async init(web3, address) {
        this.#web3 = web3
        const deployContract = contract({
            abi: DeployJs.abi,
            unlinked_binary: DeployJs.bytecode,
        })
        deployContract.setProvider(this.#web3.currentProvider)
        this.#handler = await deployContract.at(address)
    }

    get name() {
        return this.#handler.methods["name()"]()
    }

    get symbol() {
        return this.#handler.methods["symbol()"]()
    }

    get decimals() {
        return this.#handler.methods["decimals()"]()
    }
    
    get totalSupply() {
        return this.#handler.methods["totalSupply()"]()
    }
    
    async balanceOf(address) {
        return await this.#handler.methods["balanceOf(address)"](address)
    }

    async approve(fromOne, toOne, amount) {
        return await this.#handler.methods["approve(address,uint256)"](toOne, amount, {from: fromOne})
    }
}

module.exports = Erc20

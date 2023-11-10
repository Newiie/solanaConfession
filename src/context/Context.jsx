import React, {Children, createContext, useContext, useEffect, useMemo, useState} from 'react'
import * as anchor from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

import idl from '../idl.json'

const idlF = {
    "version": "0.1.0",
    "name": "confession_program",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "confession",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          }
        ]
      },
      {
        "name": "updateConfession",
        "accounts": [
          {
            "name": "confession",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "Confession",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "title",
              "type": "string"
            },
            {
              "name": "content",
              "type": "string"
            },
            {
              "name": "authority",
              "type": "publicKey"
            }
          ]
        }
      }
    ],
    "metadata": {
      "address": "2Yj7ewkPsKPn7rUV9yDGygPmUAVY95eAQxvwgk7Ts2Yf"
    }
  }
  
const ConfessionContext = createContext();
const PROGRAM_KEY = new PublicKey("2Yj7ewkPsKPn7rUV9yDGygPmUAVY95eAQxvwgk7Ts2Yf");


export const useConfession = () => {
    const context = useContext(ConfessionContext);
    if (!context) {
        throw new Error("Parent must be wrapped inside Posts Provider");
    }

    return context;
}


export const ContextProvider = ({children}) => {
    const anchorWallet = useAnchorWallet();
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [posts, setPosts] = useState([]);
    const [creating, setCreating] = useState(false);
    const [created, setCreated] = useState(false)

    console.log("Publick Key", publicKey);

    const program = useMemo(() => {
        const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
        return new anchor.Program(idl, PROGRAM_KEY, provider)
    }, [connection, anchorWallet])

    useEffect(() => {
        try {
            const getPosts = async () => {
                const conf = await program.account.confession.all();
                console.log(conf)
                if (conf)
                    setPosts(conf);
            }
            if (!creating) {
                getPosts();
            }
        } catch (err) {
            console.log("Error: ", err);
        } finally {
            setCreating(false)
        }
    }, [publicKey, program, creating])

    const initializeConfession = async (title, content) => {
        
        if (publicKey && program) {
            try {
                setCreating(true);
                const keyPair = anchor.web3.Keypair.generate();
                await program.methods.initialize(title, content)
                .accounts({
                    confession: keyPair.publicKey,
                    authority: publicKey,
                    system_program: SystemProgram.programId,
                }).signers([keyPair]).rpc()

                const conf = await program.account.confession.all();
                
                console.log("NEW ONE", conf);
            } catch (err) {
                console.log("Error: ", err);
            } finally {
                setCreating(true)
            }
        }
        
    }

    const updateConfession = async (title, content, postId) => {
        try {
            
            await program.methods.updateConfession(title, content, publicKey)
            .accounts({
                confession: postId,
            }).rpc();

            const accounts = await program.account.confession.all();
            console.log("Accounts: ", accounts);
        } catch (err) {
            console.log("Error: ", err);
        } finally {
            setCreating(true)
        }
    }
    
  return (
    <div>
      <ConfessionContext.Provider
        value = {{
            posts,
            initializeConfession,
            publicKey,
            program,
            updateConfession
        }}
      >
       {children}
      </ConfessionContext.Provider>
      
    </div>
  )
}


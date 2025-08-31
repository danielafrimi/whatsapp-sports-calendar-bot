#!/usr/bin/env node

const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

console.log('🤖 WhatsApp Sports Calendar Bot - Web QR Version');
console.log('🌐 QR code will be saved as image file');

async function startWithWebQR() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        auth: state,
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('\n📱 Generating QR code...');
            
            try {
                // Generate QR code as image file
                const qrPath = path.join(__dirname, '../qr-code.png');
                await qrcode.toFile(qrPath, qr, {
                    type: 'png',
                    width: 512,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });
                
                console.log(`✅ QR code saved: ${qrPath}`);
                console.log('\n📱 How to scan:');
                console.log('1. Open the QR code file in Finder/File Explorer');
                console.log('2. Open WhatsApp on your phone');
                console.log('3. Go to Settings → Linked Devices → Link a Device');
                console.log('4. Scan the QR code from the image file');
                
                // Also try to open it automatically
                const { exec } = require('child_process');
                exec(`open "${qrPath}"`, (error) => {
                    if (error) {
                        console.log('\n💡 Manually open: qr-code.png');
                    } else {
                        console.log('\n🖼️ QR code image opened automatically!');
                    }
                });
                
            } catch (error) {
                console.error('❌ Error generating QR code:', error);
                console.log('\n📋 QR Code Text (use any QR generator):');
                console.log(qr);
            }
        }
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('🔄 Reconnecting...');
                startWithWebQR();
            }
        } else if (connection === 'open') {
            console.log('✅ Bot connected to WhatsApp!');
            console.log('💬 Send messages to test:');
            console.log('• "customize events" → Create custom events');
            console.log('• "sports calendar" → Get sports events');
            console.log('• "tennis finals" → Tennis events only');
            
            // Clean up QR code file
            try {
                const qrPath = path.join(__dirname, '../qr-code.png');
                if (fs.existsSync(qrPath)) {
                    fs.unlinkSync(qrPath);
                    console.log('🧹 QR code file cleaned up');
                }
            } catch (error) {
                // Ignore cleanup errors
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);
    
    // Add message handling (simplified version)
    sock.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0];
        if (!message.message || message.key.fromMe) return;

        const messageText = message.message.conversation || 
                           message.message.extendedTextMessage?.text;
        
        if (messageText) {
            const chatId = message.key.remoteJid;
            console.log(`📨 Message received: ${messageText}`);
            
            // Simple response for testing
            await sock.sendMessage(chatId, { 
                text: `🤖 Bot received: "${messageText}"\n\nFor full functionality, use: npm start\n\nThis is just a QR test version!` 
            });
        }
    });
}

startWithWebQR().catch(console.error);
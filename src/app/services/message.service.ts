import { Injectable } from '@angular/core';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})

export class MessageService {
  messages: Message[] = [];

  add(messageText: string) {
    const message: Message = {
      datetime: new Date(),
      text: messageText
    }

    this.messages.push(message);
  }
}
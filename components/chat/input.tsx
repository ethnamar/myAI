"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import ChatFooter from "@/components/chat/footer";

interface ChatInputProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  isLoading: boolean;
}

export default function ChatInput({
  handleInputChange,
  handleSubmit,
  input,
  isLoading,
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Function to start the timer
  const startTimer = (seconds: number) => {
    setTimer(seconds);
    setIsTimerRunning(true);

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <>
      <div className="z-10 flex flex-col justify-center items-center fixed bottom-0 w-full p-5 bg-white shadow-[0_-10px_15px_-2px_rgba(255,255,255,1)] text-base">
        
        {/* Timer Buttons */}
        <div className="flex gap-2 mb-2">
          <Button onClick={() => startTimer(30)} className="bg-blue-500 text-white p-2 rounded">
            30s
          </Button>
          <Button onClick={() => startTimer(60)} className="bg-green-500 text-white p-2 rounded">
            60s
          </Button>
          <Button onClick={() => startTimer(90)} className="bg-red-500 text-white p-2 rounded">
            90s
          </Button>
        </div>

        {/* Timer Display */}
        {isTimerRunning && (
          <p className="text-lg font-bold text-gray-800">Time Left: {timer}s</p>
        )}

        <Form {...useForm({ defaultValues: { message: "" } })}>
          <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-lg">
            <FormField
              control={useForm().control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      {...field}
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Type your message here..."
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="w-full p-2 border rounded"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="bg-blue-500 text-white rounded p-2">
              <ArrowUp size={20} />
            </Button>
          </form>
        </Form>
      </div>
      <ChatFooter />
    </>
  );
}

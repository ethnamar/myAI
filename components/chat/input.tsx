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
      <div className="z-10 fixed bottom-0 w-full bg-white shadow-[0_-10px_15px_-2px_rgba(255,255,255,1)] text-base flex flex-col items-center pb-4 px-4">
        
        {/* Timer Buttons (Better Spacing) */}
        <div className="flex gap-4 mb-3">
          <Button onClick={() => startTimer(30)} className="bg-blue-500 text-white py-2 px-4 rounded text-lg">
            30s
          </Button>
          <Button onClick={() => startTimer(60)} className="bg-green-500 text-white py-2 px-4 rounded text-lg">
            60s
          </Button>
          <Button onClick={() => startTimer(90)} className="bg-red-500 text-white py-2 px-4 rounded text-lg">
            90s
          </Button>
        </div>

        {/* Timer Display */}
        {isTimerRunning && (
          <p className="text-lg font-bold text-gray-800 mb-2">Time Left: {timer}s</p>
        )}

        {/* Chat Input */}
        <div className="w-full max-w-3xl">
          <Form {...useForm({ defaultValues: { message: "" } })}>
            <form onSubmit={handleSubmit} className="flex gap-2">
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
              <Button type="submit" disabled={isLoading} className="bg-blue-500 text-white rounded p-3">
                <ArrowUp size={20} />
              </Button>
            </form>
          </Form>
        </div>

        {/* Keep Terms of Service Visible */}
        <div className="mt-2 w-full flex justify-center">
          <ChatFooter />
        </div>
      </div>
    </>
  );
}

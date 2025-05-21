"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const faqData = [
  {
    question: "What is Karl's Full Name?",
    answer: "Karl's Full Name is Karl Erik Nystrom"
  },
  {
    question: "What is Karl's Pen Name?",
    answer: "Pen Name of Karl is 'Carlo De Luca'"
  },
  {
    question: "Where is Karl Living Now?",
    answer: "Karl is currently living in Philippines"
  },
  {
    question: "What is Karl's Wife Name?",
    answer: "Karl's wife name is Maria Nystrom"
  },
  {
    question: "When is Karl's date of birth?",
    answer: "Karl's date of birth is 8 October 1954"
  },
  {
    question: "What is Karl's political affiliation?",
    answer: "A political old conservative. One world, one people. Freedom of speech. And peace all over the world."
  },
  {
    question: "What is Karl's religion?",
    answer: "Karl belong to Christian Lutheran religion"
  },
  {
    question: "Is there any new upcoming book from Karl?",
    answer: "Yes, There comes a continued version with more details about the happenings. Living the dreams, No. 2. But September"
  },
  {
    question: "Why did Karl become a writer?",
    answer: "Writing is engaging and gives people the courage to get out of everyday life and find inspiration"
  },
  {
    question: "Does Karl accept story ideas?",
    answer: "Yes, Karl of course accept the story ideas"
  },
  {
    question: "Are there any plans to publish a novel or a screenplay?",
    answer: "Yes, Maybe a screenplay, which is in fact offered as a documentary here in the Philippines"
  },
  {
    question: "Where is Karl travelling next?",
    answer: "Karl's next trips are Japan - Cambodia and to Texas and meet my old friends."
  }
]

export default function FAQPage() {
  return (
    <section className="bg-[#252231] py-12">
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card className="bg-[#2d2b3b] border-none">
          <CardHeader>
            <CardTitle className="text-3xl text-gray-100 font-bold text-center">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-gray-700"
                >
                  <AccordionTrigger className="text-gray-200 text-left hover:no-underline font-semibold text-lg hover:text-red-500 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 text-base pl-4 italic border-l-2 border-red-500/50">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  )
} 
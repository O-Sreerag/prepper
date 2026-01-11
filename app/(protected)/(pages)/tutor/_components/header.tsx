import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export const HeaderComponent = ({showSidebar, setShowSidebar}: {showSidebar: boolean, setShowSidebar: (value: boolean) => void}) => {
    return (
        <>
            <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">AI Tutor</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">Get instant help with questions and concepts</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="lg:hidden bg-transparent"
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        <Icons.fileText className="mr-2 h-4 w-4" />
                        History
                    </Button>
                    <Button variant="outline" size="sm">
                        <Icons.rotateCcw className="mr-2 h-4 w-4" />
                        New Chat
                    </Button>
                </div>
            </div>
        </>
    )
}
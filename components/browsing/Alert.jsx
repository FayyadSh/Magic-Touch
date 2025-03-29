// ------------ Components ----------------
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/shadcn/alert-dialog";
import { Button } from "../ui/shadcn/button";
// ------------ Auth ----------------
import { signIn } from "next-auth/react";

const Alert = ({ children }) => {
  return (
    <AlertDialog> {/* The root component of the alert dialog */}
      {/* The trigger that opens the alert dialog */}
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      
      <AlertDialogContent className='bg-background-color border-1'>
        <AlertDialogHeader>
          {/* Title of the alert dialog */}
          <AlertDialogTitle className='text-primary'>
            Unauthenticated
          </AlertDialogTitle>
          
          {/* Description or message shown in the alert dialog */}
          <AlertDialogDescription className='text-sky-500/40 font-bold tracking-wider'>
            You Need To Sign In First
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* Cancel button that closes the alert dialog */}
          <AlertDialogCancel className='border-none text-sky-400 bg-background-secondary-color cursor-pointer hover:opacity-70'>
            Cancel
          </AlertDialogCancel>
          
          {/* Button to trigger sign-in process */}
          <Button 
            onClick={() => signIn("descope")} 
            className='text-white hover:opacity-70'
          >
            <AlertDialogAction className='shadow-none cursor-pointer'>
              Continue {/* Action to continue after clicking the button */}
            </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};


export default Alert;
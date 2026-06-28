"use client";



import Link from "next/link";

import { Sparkles } from "lucide-react";

import { FashionNavBar } from "@/design-system";

import { useSession } from "@/components/providers";

import { APP_ROUTES } from "@/shared/constants/routes";

import { DEMO_ROUTES } from "../../../constants/demo.constants";

import { LandingPrimaryLink } from "./landing-primary-link";

import { LandingOutlineLink } from "./landing-outline-link";



export function LandingNav() {

  const { user, isLoading } = useSession();



  return (

    <FashionNavBar variant="floating" className="max-w-4xl">

      <Link

        href={DEMO_ROUTES.landing}

        className="flex items-center gap-2.5 text-heading-sm text-foreground"

        aria-label="AI Wardrobe home"

      >

        <div className="flex size-8 items-center justify-center rounded-full bg-foreground/5">

          <Sparkles className="size-3.5 text-champagne" strokeWidth={1.5} />

        </div>

        <span className="hidden sm:inline">AI Wardrobe</span>

      </Link>



      <div className="flex items-center gap-2">

        {!isLoading && user ? (

          <>

            <span className="hidden max-w-[140px] truncate text-sm text-muted-foreground md:inline">

              {user.email}

            </span>

            <LandingPrimaryLink href={APP_ROUTES.dashboard} size="pill">

              Dashboard

            </LandingPrimaryLink>

            <LandingOutlineLink href={DEMO_ROUTES.studio} size="pill">

              Studio

            </LandingOutlineLink>

          </>

        ) : (

          <>

            <LandingOutlineLink href={APP_ROUTES.login} size="pill">

              Log in

            </LandingOutlineLink>

            <LandingPrimaryLink href={APP_ROUTES.register} size="pill">

              Sign up

            </LandingPrimaryLink>

          </>

        )}

      </div>

    </FashionNavBar>

  );

}



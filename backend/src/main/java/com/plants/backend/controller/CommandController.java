package com.plants.backend.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/run-command")
public class CommandController {

    @PostMapping("/download")
    public ResponseEntity<String> runCommand(
    		 @RequestParam("command") String command) {
    	
   	System.out.println("Received POST /run-command/download");
   	System.out.println("Command: " + command);

   	 
        try {
            ProcessBuilder builder = new ProcessBuilder();
          
            builder.command("bash", "-c", command);

            Process process = builder.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()));

            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return ResponseEntity.ok(output.toString());
            } else {
                return ResponseEntity.status(500).body("Command failed with exit code: " + exitCode);
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}

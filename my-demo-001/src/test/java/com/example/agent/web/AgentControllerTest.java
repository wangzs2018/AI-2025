package com.example.agent.web;

import com.example.agent.domain.Agent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AgentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void fullCrudFlow() throws Exception {
        Agent a = new Agent("Alice","OPERATOR","ACTIVE");
        // Create
        String createJson = objectMapper.writeValueAsString(a);
        String created = mockMvc.perform(post("/agents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andReturn().getResponse().getContentAsString();
        Agent createdAgent = objectMapper.readValue(created, Agent.class);

        // Read list
        mockMvc.perform(get("/agents"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Alice"));

        // Update
        createdAgent.setName("Alice Updated");
        String updateJson = objectMapper.writeValueAsString(createdAgent);
        mockMvc.perform(put("/agents/" + createdAgent.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Alice Updated"));

        // Delete
        mockMvc.perform(delete("/agents/" + createdAgent.getId()))
                .andExpect(status().isNoContent());

        // Confirm deletion
        mockMvc.perform(get("/agents/" + createdAgent.getId()))
                .andExpect(status().isNotFound());
    }
}

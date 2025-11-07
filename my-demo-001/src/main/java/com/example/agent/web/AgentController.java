package com.example.agent.web;

import com.example.agent.domain.Agent;
import com.example.agent.service.AgentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agents")
public class AgentController {
    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @GetMapping
    public List<Agent> list() {
        return agentService.listAll();
    }

    @GetMapping("/{id}")
    public Agent get(@PathVariable Long id) {
        return agentService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Agent create(@RequestBody Agent agent) {
        return agentService.create(agent);
    }

    @PutMapping("/{id}")
    public Agent update(@PathVariable Long id, @RequestBody Agent agent) {
        return agentService.update(id, agent);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        agentService.delete(id);
    }
}
